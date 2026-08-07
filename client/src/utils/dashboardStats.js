import { getResumeHistory } from './historyStorage';

export const getRealDashboardStats = () => {
  // 1. Resume Score
  const resumeHistory = getResumeHistory();
  let latestResumeScore = null;
  let latestAtsScore = null;

  if (Array.isArray(resumeHistory) && resumeHistory.length > 0) {
    const latest = resumeHistory[0]; // Newest first
    latestResumeScore = latest.resumeScore || latest.score || null;
    latestAtsScore = latest.atsScore || latestResumeScore;
  }

  // 2. Job Match Rate
  let jobMatchScore = null;
  try {
    const savedJobMatch = localStorage.getItem('career_pilot_latest_job_match');
    if (savedJobMatch) {
      const parsed = JSON.parse(savedJobMatch);
      jobMatchScore = parsed.overallScore || parsed.matchPercentage || parsed.score || null;
    }
  } catch (e) {}

  // 3. Roadmap Completion Progress
  let roadmapPercent = null;
  let activeRoadmapTitle = null;
  try {
    const savedActiveRoadmap = localStorage.getItem('career_pilot_active_roadmap');
    if (savedActiveRoadmap) {
      const parsedRoadmap = JSON.parse(savedActiveRoadmap);
      activeRoadmapTitle = parsedRoadmap.targetRole || parsedRoadmap.title || null;
      
      const roadmapId = parsedRoadmap.roadmapId || parsedRoadmap.id || `rm_${(activeRoadmapTitle || '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
      const savedProgress = localStorage.getItem(`career_pilot_roadmap_progress_${roadmapId}`);
      
      if (savedProgress) {
        const completedTopics = JSON.parse(savedProgress);
        const steps = parsedRoadmap.roadmap || [];
        let total = 0;
        let done = 0;

        steps.forEach((step, sIdx) => {
          const topics = Array.isArray(step.topics) ? step.topics : (Array.isArray(step.skills) ? step.skills : []);
          topics.forEach((_, tIdx) => {
            total++;
            if (completedTopics[`step_${sIdx}_topic_${tIdx}`]) done++;
          });
        });

        roadmapPercent = total > 0 ? Math.round((done / total) * 100) : 0;
      } else {
        roadmapPercent = 0;
      }
    }
  } catch (e) {}

  // 4. Mock Interview Score
  let interviewScore = null;
  try {
    const savedInterview = localStorage.getItem('career_pilot_latest_interview');
    if (savedInterview) {
      const parsed = JSON.parse(savedInterview);
      interviewScore = parsed.score || parsed.readinessScore || null;
    }
  } catch (e) {}

  // 5. Calculate Overall Career Score dynamically
  const availableScores = [];
  if (latestAtsScore !== null) availableScores.push(latestAtsScore);
  if (jobMatchScore !== null) availableScores.push(jobMatchScore);
  if (roadmapPercent !== null) availableScores.push(roadmapPercent);
  if (interviewScore !== null) availableScores.push(interviewScore);

  let overallCareerScore = null;
  if (availableScores.length > 0) {
    const sum = availableScores.reduce((acc, val) => acc + val, 0);
    overallCareerScore = Math.round(sum / availableScores.length);
  }

  return {
    resumeCount: resumeHistory.length,
    latestResumeScore,
    latestAtsScore,
    jobMatchScore,
    roadmapPercent,
    activeRoadmapTitle,
    interviewScore,
    overallCareerScore,
    hasAnyData: availableScores.length > 0
  };
};
