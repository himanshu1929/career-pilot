import { Router } from 'express';
import { uploadResumeMiddleware } from '../middleware/upload.middleware.js';
import { analyzeJobMatch } from '../controllers/jobMatch.controller.js';

const router = Router();

// POST /api/job-match/analyze - Supports optional PDF upload or JSON body
router.post('/analyze', uploadResumeMiddleware.single('resume'), analyzeJobMatch);

export default router;
