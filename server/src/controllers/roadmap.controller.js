import { generateRoadmapWithGemini, isQuotaExceededError } from '../services/gemini.service.js';

export const generateRoadmap = async (req, res) => {
  try {
    const { targetRole, currentSkills, missingSkills, experienceLevel } = req.body;

    if (!targetRole || typeof targetRole !== 'string' || !targetRole.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Target Role / Career Goal missing. Please provide "targetRole".'
      });
    }

    const roadmapData = await generateRoadmapWithGemini({
      targetRole: targetRole.trim(),
      currentSkills: (currentSkills || 'Programming Fundamentals, Git').trim(),
      missingSkills: Array.isArray(missingSkills) ? missingSkills : (missingSkills ? [missingSkills] : []),
      experienceLevel: (experienceLevel || 'Entry-Level (0-2 YOE)').trim()
    });

    return res.status(200).json({
      success: true,
      message: 'Learning roadmap generated successfully.',
      data: roadmapData
    });

  } catch (error) {
    console.error('Error generating learning roadmap:', error);

    if (error.status === 429 || error.status === 503 || error.errorType === 'QUOTA_EXCEEDED' || isQuotaExceededError(error)) {
      return res.status(429).json({
        success: false,
        errorType: 'QUOTA_EXCEEDED',
        message: 'The AI service is currently experiencing high demand. Please try again later.'
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while generating learning roadmap.'
    });
  }
};
