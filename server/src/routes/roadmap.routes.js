import { Router } from 'express';
import { generateRoadmap } from '../controllers/roadmap.controller.js';

const router = Router();

// POST /api/roadmap/generate
router.post('/generate', generateRoadmap);

export default router;
