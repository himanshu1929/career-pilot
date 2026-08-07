import { extractTextFromPDF } from '../services/pdf.service.js';
import { analyzeResumeWithGemini, isQuotaExceededError } from '../services/gemini.service.js';
import fs from 'fs';
import crypto from 'crypto';

// In-memory cache mapping SHA-256 hash -> analysis payload
const resumeHashCache = new Map();

// Helper to compute SHA-256 hash of a file buffer or string
export const computeSHA256 = (input) => {
  return crypto.createHash('sha256').update(input).digest('hex');
};

export const uploadAndAnalyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No PDF file provided. Please upload a file with field name "resume".'
      });
    }

    const file = req.file;
    const filePath = file.path;

    // Read buffer to compute SHA-256 hash
    const fileBuffer = fs.readFileSync(filePath);
    const contentHash = computeSHA256(fileBuffer);

    // 1. Check if an analysis already exists for the exact same SHA-256 hash
    if (resumeHashCache.has(contentHash)) {
      console.log(`[Deterministic Cache Hit] Returning cached analysis for SHA-256: ${contentHash.slice(0, 12)}...`);
      
      // Clean up uploaded temp file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const cachedData = resumeHashCache.get(contentHash);

      return res.status(200).json({
        success: true,
        cached: true,
        message: 'This resume has already been analyzed. Displaying the cached analysis.',
        data: {
          ...cachedData,
          cached: true,
          contentHash,
          meta: {
            ...cachedData.meta,
            originalName: file.originalname,
            cachedAt: new Date().toISOString()
          }
        }
      });
    }

    // 2. Extract raw text from PDF
    const { text, numPages } = await extractTextFromPDF(filePath);
    const cleanText = text.trim();

    if (!cleanText) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(422).json({
        success: false,
        error: 'Could not extract text from the PDF file. Ensure it is not an image-only scan.'
      });
    }

    // 3. Pass extracted text to Gemini AI
    const aiAnalysis = await analyzeResumeWithGemini(cleanText);

    // 4. Construct response payload
    const analysisPayload = {
      score: aiAnalysis.score,
      atsScore: aiAnalysis.atsScore,
      candidateLevel: aiAnalysis.candidateLevel,
      interviewPotential: aiAnalysis.interviewPotential,
      atsAssessment: aiAnalysis.atsAssessment,
      executiveSummary: aiAnalysis.executiveSummary,
      strengths: aiAnalysis.strengths,
      weaknesses: aiAnalysis.weaknesses,
      missingSkills: aiAnalysis.missingSkills,
      recommendations: aiAnalysis.recommendations,
      cached: false,
      contentHash,
      meta: {
        originalName: file.originalname,
        sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        numPages: numPages,
        wordCount: cleanText.split(/\s+/).length,
        analyzedAt: new Date().toISOString()
      }
    };

    // 5. Store new analysis in SHA-256 cache
    resumeHashCache.set(contentHash, analysisPayload);

    // Clean up temp file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).json({
      success: true,
      cached: false,
      message: 'Resume analyzed by Gemini AI successfully.',
      data: analysisPayload
    });

  } catch (error) {
    console.error('Error handling resume upload and analysis:', error);
    
    // Clean up temp file if error occurs
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Detect HTTP 429 / Quota Exceeded error
    if (error.status === 429 || error.errorType === 'QUOTA_EXCEEDED' || isQuotaExceededError(error)) {
      return res.status(429).json({
        success: false,
        errorType: 'QUOTA_EXCEEDED',
        message: 'The AI service has reached its temporary usage limit. Please try again later.'
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while analyzing resume.'
    });
  }
};

export const analyzeResumeTextDirect = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide valid "resumeText" string in the request body.'
      });
    }

    const cleanText = resumeText.trim();
    const contentHash = computeSHA256(cleanText);

    if (resumeHashCache.has(contentHash)) {
      const cachedData = resumeHashCache.get(contentHash);
      return res.status(200).json({
        success: true,
        cached: true,
        message: 'This resume has already been analyzed. Displaying the cached analysis.',
        data: {
          ...cachedData,
          cached: true,
          contentHash
        }
      });
    }

    const aiAnalysis = await analyzeResumeWithGemini(cleanText);

    const analysisPayload = {
      score: aiAnalysis.score,
      atsScore: aiAnalysis.atsScore,
      candidateLevel: aiAnalysis.candidateLevel,
      interviewPotential: aiAnalysis.interviewPotential,
      atsAssessment: aiAnalysis.atsAssessment,
      executiveSummary: aiAnalysis.executiveSummary,
      strengths: aiAnalysis.strengths,
      weaknesses: aiAnalysis.weaknesses,
      missingSkills: aiAnalysis.missingSkills,
      recommendations: aiAnalysis.recommendations,
      cached: false,
      contentHash
    };

    resumeHashCache.set(contentHash, analysisPayload);

    return res.status(200).json({
      success: true,
      cached: false,
      message: 'Resume text analyzed by Gemini AI successfully.',
      data: analysisPayload
    });

  } catch (error) {
    console.error('Error handling text resume analysis:', error);

    if (error.status === 429 || error.errorType === 'QUOTA_EXCEEDED' || isQuotaExceededError(error)) {
      return res.status(429).json({
        success: false,
        errorType: 'QUOTA_EXCEEDED',
        message: 'The AI service has reached its temporary usage limit. Please try again later.'
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while analyzing resume text.'
    });
  }
};
