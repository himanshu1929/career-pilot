import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ArrowRight, Info } from 'lucide-react';

const STEP_DETAILS = {
  resume: { title: 'Resume Analyzer', route: '/app/resume-analyzer' },
  jobMatch: { title: 'Job Matcher', route: '/app/job-matcher' },
  roadmap: { title: 'Skill Gap & Roadmap', route: '/app/roadmap' },
  interview: { title: 'AI Mock Interview', route: '/app/mock-interview' }
};

const defaultJourneyState = {
  hasResume: false,
  hasJobMatch: false,
  hasRoadmap: false,
  hasInterview: false,
  completed: {
    resume: false,
    jobMatch: false,
    roadmap: false,
    interview: false
  },
  currentRecommendedStep: null
};

export const GuidedJourneyBanner = ({ currentFeatureId }) => {
  const workspaceContext = useWorkspace();
  const journeyState = workspaceContext?.journeyState || defaultJourneyState;
  const navigate = useNavigate();

  const completed = journeyState?.completed || defaultJourneyState.completed;
  const hasResume = Boolean(journeyState?.hasResume || completed?.resume);
  const hasJobMatch = Boolean(journeyState?.hasJobMatch || completed?.jobMatch);
  const hasRoadmap = Boolean(journeyState?.hasRoadmap || completed?.roadmap);

  const recommendedKey = typeof journeyState?.currentRecommendedStep === 'string'
    ? journeyState.currentRecommendedStep
    : journeyState?.currentRecommendedStep?.id;

  const recommendedStepInfo = STEP_DETAILS[recommendedKey] || null;

  // Determine if user skipped prerequisite steps for this feature
  let isSkipped = false;
  let prereqName = '';

  if (currentFeatureId === 'jobMatch' && !hasResume) {
    isSkipped = true;
    prereqName = 'Resume Analyzer';
  } else if (currentFeatureId === 'roadmap' && !hasJobMatch) {
    isSkipped = true;
    prereqName = hasResume ? 'Job Matcher' : 'Resume Analyzer';
  } else if (currentFeatureId === 'interview' && !hasRoadmap) {
    isSkipped = true;
    prereqName = hasJobMatch ? 'Skill Gap & Roadmap' : 'Resume Analyzer';
  }

  if (!isSkipped || !recommendedStepInfo) return null;

  return (
    <div className="bg-[#161B22] border border-blue-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-fadeIn mb-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <p className="text-xs text-gray-300">
          <strong className="text-white">AI Mentor Tip:</strong> For the most personalized results, we recommend completing <strong className="text-blue-400">{prereqName}</strong> before using this tool.
        </p>
      </div>

      <button
        onClick={() => navigate(recommendedStepInfo.route)}
        className="px-3.5 py-1.5 bg-[#0D1117] hover:bg-[#21262d] text-blue-400 hover:text-blue-300 border border-blue-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-end sm:self-auto flex-shrink-0"
      >
        <span>Go to {recommendedStepInfo.title}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
