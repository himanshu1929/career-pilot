import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useWorkspace } from './context/WorkspaceContext';
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardHeader } from './features/dashboard/DashboardHeader';
import { ScoreOverview } from './features/dashboard/ScoreOverview';
import { QuickActions } from './features/dashboard/QuickActions';
import { RecentActivity } from './features/dashboard/RecentActivity';
import { ProfilePage } from './pages/ProfilePage';
import { ResumePage } from './pages/ResumePage';
import { JobMatchPage } from './pages/JobMatchPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { InterviewPage } from './pages/InterviewPage';

import { GettingStarted } from './features/dashboard/GettingStarted';

import { PageContainer } from './components/layout/PageContainer';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const handleNavigateTab = (tab) => {
    const target = {
      'resume': '/app/resume-analyzer',
      'job-match': '/app/job-matcher',
      'roadmap': '/app/roadmap',
      'interview': '/app/mock-interview'
    }[tab] || '/app/dashboard';
    navigate(target);
  };

  return (
    <PageContainer>
      <DashboardHeader />
      <GettingStarted onNavigate={handleNavigateTab} />
      <ScoreOverview onNavigate={handleNavigateTab} />
      <RecentActivity onNavigate={handleNavigateTab} />
    </PageContainer>
  );
};

const LandingPageWrapper = () => {
  const navigate = useNavigate();
  const { profile } = useWorkspace();

  useEffect(() => {
    document.title = 'Landing | CareerPilot';
  }, []);

  const handleLaunch = () => {
    if (profile?.completedOnboarding) {
      navigate('/app/dashboard');
    } else {
      navigate('/welcome');
    }
  };

  return <LandingPage onLaunchApp={handleLaunch} />;
};

const OnboardingPageWrapper = () => {
  useEffect(() => {
    document.title = 'Welcome | CareerPilot';
  }, []);

  return <OnboardingPage />;
};

export function App() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#090a0f]">
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPageWrapper />} />

        {/* First-Time User Onboarding Route */}
        <Route path="/welcome" element={<OnboardingPageWrapper />} />

        {/* Dashboard Shell with Persistent Sidebar Layout */}
        <Route path="/app" element={<AppLayout onGoHome={() => navigate('/')} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="resume-analyzer" element={<ResumePage />} />
          <Route path="job-matcher" element={<JobMatchPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="mock-interview" element={<InterviewPage />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
