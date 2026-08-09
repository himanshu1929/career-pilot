import express from 'express';
import {
  generateInterviewQuestion,
  processInterviewTurn
} from '../controllers/interview.controller.js';

const router = express.Router();

router.post('/question', generateInterviewQuestion);
router.post('/turn', processInterviewTurn);

export default router;