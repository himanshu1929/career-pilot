import { extractTextFromPDF } from '../services/pdf.service.js';
import { matchJobDescriptionWithGemini, isQuotaExceededError } from '../services/gemini.service.js';
import fs from 'fs';

export const analyzeJobMatch = async (req, res) => {
  console.log("=== Job Match Request ===");
  console.log("Body:", req.body);
  console.log("File:", req.file);
  console.log("Files:", req.files);
  console.log("=========================");

  try {
    let resumeText = req.body.resumeText || '';
    const jobDescription = req.body.jobDescription || '';

    // If PDF file uploaded via multipart form data
    if (req.file) {
      try {
        const { text } = await extractTextFromPDF(req.file.path);
        if (text && text.trim()) {
          resumeText = text.trim();
        }
      } catch (pdfErr) {
        console.warn('PDF extraction failed on file. Checking fallback resumeText in request body.', pdfErr.message);
      } finally {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    }

    if (!resumeText && req.body.resumeText) {
      resumeText = req.body.resumeText.trim();
    }

    if (!resumeText || typeof resumeText !== 'string' || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Resume text content could not be read from the uploaded PDF. Please upload a clear text PDF resume.'
      });
    }

    if (!jobDescription || typeof jobDescription !== 'string' || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Target Job Description missing. Please provide the job posting text.'
      });
    }

    // Pass resume text and job description to Gemini AI
    const matchAnalysis = await matchJobDescriptionWithGemini(resumeText.trim(), jobDescription.trim());

    return res.status(200).json({
      success: true,
      message: 'Job match analysis completed successfully by Gemini AI.',
      data: {
        matchScore: matchAnalysis.matchScore,
        matchingSkills: matchAnalysis.matchingSkills,
        missingSkills: matchAnalysis.missingSkills,
        strengths: matchAnalysis.strengths,
        weaknesses: matchAnalysis.weaknesses,
        resumeImprovements: matchAnalysis.resumeImprovements,
        hiringSummary: matchAnalysis.hiringSummary
      }
    });

  } catch (error) {
    console.error('Error handling job match analysis:', error);

    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.status === 429 || error.errorType === 'QUOTA_EXCEEDED' || isQuotaExceededError(error)) {
      return res.status(429).json({
        success: false,
        errorType: 'QUOTA_EXCEEDED',
        message: 'The AI service has reached its temporary usage limit. Please try again later.'
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while analyzing job description match.'
    });
  }
};
