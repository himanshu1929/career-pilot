import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { InterviewSetup } from '../features/interview/InterviewSetup';
import { InterviewSimulator } from '../features/interview/InterviewSimulator';
import { InterviewSummary } from '../features/interview/InterviewSummary';
import { GuidedJourneyBanner } from '../components/layout/GuidedJourneyBanner';

import { PageContainer } from '../components/layout/PageContainer';

export const InterviewPage = () => {
  const { addInterview } = useWorkspace();

  const [stage, setStage] = useState('setup'); // 'setup' | 'active' | 'summary'
  const [loading, setLoading] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [completedHistory, setCompletedHistory] = useState([]);

  const handleStartInterview = (config) => {
    setSetupData(config);
    setLoading(false);
    setStage('active');
  };

  const handleFinishInterview = (history) => {
    setCompletedHistory(history);

    // Compute score and dispatch to Workspace Context Single Source of Truth
    const scores = history.map(item => item.feedback?.score || 78);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 80;

    addInterview({
      targetRole: setupData?.targetRole || 'Software Engineer',
      difficulty: setupData?.difficulty || 'Medium',
      interviewType: setupData?.interviewType || 'Mixed',
      score: avgScore,
      questionCount: history.length,
      history
    });

    setStage('summary');
  };

  const handleViewSavedReport = (savedItem) => {
    setSetupData({
      targetRole: savedItem.targetRole || 'Software Engineer',
      difficulty: savedItem.difficulty || 'Medium',
      experienceLevel: savedItem.experienceLevel || 'Professional',
      interviewType: savedItem.interviewType || 'Mixed'
    });
    setCompletedHistory(savedItem.history || []);
    setStage('summary');
  };

  const handleRestart = () => {
    setStage('setup');
    setSetupData(null);
    setCompletedHistory([]);
  };

  return (
    <PageContainer>
      
      {/* Non-Blocking Guided Journey Banner */}
      <GuidedJourneyBanner currentFeatureId="interview" />

      {stage === 'setup' && (
        <InterviewSetup
          onStart={handleStartInterview}
          loading={loading}
          onViewSavedReport={handleViewSavedReport}
        />
      )}

      {stage === 'active' && setupData && (
        <InterviewSimulator
          setupData={setupData}
          onFinish={handleFinishInterview}
        />
      )}

      {stage === 'summary' && setupData && (
        <InterviewSummary
          setupData={setupData}
          history={completedHistory}
          onRestart={handleRestart}
        />
      )}
    </PageContainer>
  );
};
