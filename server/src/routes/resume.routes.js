import { Router } from 'express';
import { uploadResumeMiddleware } from '../middleware/upload.middleware.js';
import { uploadAndAnalyzeResume, analyzeResumeTextDirect } from '../controllers/resume.controller.js';

const router = Router();

// POST /api/resume/upload - Accepts PDF file, extracts text, calls Gemini AI
router.post('/upload', uploadResumeMiddleware.single('resume'), uploadAndAnalyzeResume);

// POST /api/resume/analyze-text - Accepts raw JSON { resumeText }, calls Gemini AI
router.post('/analyze-text', analyzeResumeTextDirect);

export default router;
