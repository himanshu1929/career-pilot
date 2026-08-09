import {
    generateInterviewQuestionWithGemini,
    processInterviewTurnWithGemini,
    isQuotaExceededError
  } from '../services/gemini.service.js';
  
  export const generateInterviewQuestion = async (req, res) => {
    try {
      const {
        targetRole,
        experienceLevel,
        interviewType,
        difficulty,
        resumeContext,
        persona,
        questionIndex,
        previousHistory
      } = req.body;
  
      if (!targetRole || typeof targetRole !== 'string' || !targetRole.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Target role is required.'
        });
      }
  
      const question = await generateInterviewQuestionWithGemini({
        targetRole: targetRole.trim(),
        experienceLevel,
        interviewType,
        difficulty,
        resumeContext,
        persona,
        questionIndex: Number(questionIndex || 0),
        previousHistory: Array.isArray(previousHistory) ? previousHistory : []
      });
  
      return res.status(200).json({
        success: true,
        data: question
      });
    } catch (error) {
      console.error('Error generating interview question:', error);
  
      if (
        error.status === 429 ||
        error.status === 503 ||
        error.errorType === 'QUOTA_EXCEEDED' ||
        isQuotaExceededError(error)
      ) {
        return res.status(429).json({
          success: false,
          errorType: 'QUOTA_EXCEEDED',
          message: 'The AI interview service is temporarily unavailable. Please try again later.'
        });
      }
  
      return res.status(500).json({
        success: false,
        error: error.message || 'Unable to generate interview question.'
      });
    }
  };
  
  export const processInterviewTurn = async (req, res) => {
    try {
      const {
        targetRole,
        experienceLevel,
        interviewType,
        difficulty,
        resumeContext,
        persona,
        currentQuestion,
        answer,
        previousHistory,
        questionIndex
      } = req.body;
  
      if (!currentQuestion) {
        return res.status(400).json({
          success: false,
          error: 'Current interview question is required.'
        });
      }
  
      if (!answer || typeof answer !== 'string' || !answer.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Candidate answer is required.'
        });
      }
  
      const result = await processInterviewTurnWithGemini({
        targetRole,
        experienceLevel,
        interviewType,
        difficulty,
        resumeContext,
        persona,
        currentQuestion,
        answer: answer.trim(),
        previousHistory: Array.isArray(previousHistory) ? previousHistory : [],
        questionIndex: Number(questionIndex || 0)
      });
  
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error processing interview turn:', error);
  
      if (
        error.status === 429 ||
        error.status === 503 ||
        error.errorType === 'QUOTA_EXCEEDED' ||
        isQuotaExceededError(error)
      ) {
        return res.status(429).json({
          success: false,
          errorType: 'QUOTA_EXCEEDED',
          message: 'The AI interview service is temporarily unavailable. Please try again later.'
        });
      }
  
      return res.status(500).json({
        success: false,
        error: error.message || 'Unable to process interview answer.'
      });
    }
  };