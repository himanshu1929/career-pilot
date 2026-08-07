import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import resumeRoutes from './routes/resume.routes.js';
import jobMatchRoutes from './routes/jobMatch.routes.js';
import roadmapRoutes from './routes/roadmap.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// API Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/job-match', jobMatchRoutes);
app.use('/api/roadmap', roadmapRoutes);

// Base health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CareerPilot Express API Gateway' });
});

// App bootstrap
app.listen(PORT, () => {
  console.log(`CareerPilot Express server running on port ${PORT}`);
});
