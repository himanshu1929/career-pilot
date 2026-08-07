import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { DashboardHeader } from '../features/dashboard/DashboardHeader';
import { CareerJourneyStepper } from '../features/dashboard/CareerJourneyStepper';
import { ScoreOverview } from '../features/dashboard/ScoreOverview';
import { QuickActions } from '../features/dashboard/QuickActions';
import { RecentActivity } from '../features/dashboard/RecentActivity';
import { ResumePage } from './ResumePage';
import { JobMatchPage } from './JobMatchPage';
import { RoadmapPage } from './RoadmapPage';
import { InterviewPage } from './InterviewPage';
import { Compass, Menu, X, ArrowLeft, Mic } from 'lucide-react';

const PATH_TITLES = {
  '/app/dashboard': 'Dashboard | CareerPilot',
  '/app/resume-analyzer': 'Resume Analyzer | CareerPilot',
  '/app/job-matcher': 'Job Matcher | CareerPilot',
  '/app/roadmap': 'Skill Gap & Roadmap | CareerPilot',
  '/app/mock-interview': 'AI Mock Interview | CareerPilot'
};

export const DashboardPage = ({ onGoHome }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Automatically update document.title on route change
  useEffect(() => {
    const title = PATH_TITLES[location.pathname] || 'CareerPilot';
    document.title = title;
  }, [location.pathname]);

  // Global event listener for custom navigate_module dispatches
  useEffect(() => {
    const handleNavigate = (e) => {
      if (e.detail && e.detail.moduleId) {
        const targetRoute = {
          'resume': '/app/resume-analyzer',
          'job-match': '/app/job-matcher',
          'interview': '/app/mock-interview',
          'roadmap': '/app/roadmap',
          'dashboard': '/app/dashboard'
        }[e.detail.moduleId] || '/app/dashboard';
        
        navigate(targetRoute);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('navigate_module', handleNavigate);
    return () => window.removeEventListener('navigate_module', handleNavigate);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-100 flex">
      
      {/* Desktop Sidebar */}
      <Sidebar onGoHome={onGoHome} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-[#0D1117]/95 px-4 py-3 border-b border-[#30363D] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onGoHome}>
            <div className="w-8 h-8 rounded bg-[#161B22] border border-[#30363D] flex items-center justify-center">
              <Compass className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-base font-bold text-white">CareerPilot</span>
          </div>

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded text-gray-400 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Sidebar Overlay Drawer */}
        {mobileSidebarOpen && (
          <div className="md:hidden bg-[#161B22] border-b border-[#30363D] p-4 space-y-2 sticky top-[57px] z-30">
            <button
              onClick={() => { navigate('/app/dashboard'); setMobileSidebarOpen(false); }}
              className={`w-full text-left py-2.5 px-3 rounded text-sm ${location.pathname === '/app/dashboard' ? 'bg-blue-600 text-white font-bold' : 'text-gray-300'}`}
            >
              Dashboard Overview
            </button>
            <button
              onClick={() => { navigate('/app/resume-analyzer'); setMobileSidebarOpen(false); }}
              className={`w-full text-left py-2.5 px-3 rounded text-sm ${location.pathname === '/app/resume-analyzer' ? 'bg-blue-600 text-white font-bold' : 'text-gray-300'}`}
            >
              Resume Analyzer
            </button>
            <button
              onClick={() => { navigate('/app/job-matcher'); setMobileSidebarOpen(false); }}
              className={`w-full text-left py-2.5 px-3 rounded text-sm ${location.pathname === '/app/job-matcher' ? 'bg-blue-600 text-white font-bold' : 'text-gray-300'}`}
            >
              Job Matcher
            </button>
            <button
              onClick={() => { navigate('/app/roadmap'); setMobileSidebarOpen(false); }}
              className={`w-full text-left py-2.5 px-3 rounded text-sm ${location.pathname === '/app/roadmap' ? 'bg-blue-600 text-white font-bold' : 'text-gray-300'}`}
            >
              Skill Gap & Roadmap
            </button>
            <button
              onClick={() => { navigate('/app/mock-interview'); setMobileSidebarOpen(false); }}
              className={`w-full text-left py-2.5 px-3 rounded text-sm ${location.pathname === '/app/mock-interview' ? 'bg-blue-600 text-white font-bold' : 'text-gray-300'}`}
            >
              AI Mock Interview
            </button>
          </div>
        )}

        {/* Main Workspace with React Router Routes */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          <Routes>
            <Route path="dashboard" element={
              <div className="space-y-8">
                <DashboardHeader onActionClick={(tab) => {
                  const target = {
                    'resume': '/app/resume-analyzer',
                    'job-match': '/app/job-matcher',
                    'roadmap': '/app/roadmap',
                    'interview': '/app/mock-interview'
                  }[tab] || '/app/dashboard';
                  navigate(target);
                }} />
                
                <CareerJourneyStepper />

                <ScoreOverview onNavigate={(tab) => {
                  const target = {
                    'resume': '/app/resume-analyzer',
                    'job-match': '/app/job-matcher',
                    'roadmap': '/app/roadmap',
                    'interview': '/app/mock-interview'
                  }[tab] || '/app/dashboard';
                  navigate(target);
                }} />
                <QuickActions onNavigate={(tab) => {
                  const target = {
                    'resume': '/app/resume-analyzer',
                    'job-match': '/app/job-matcher',
                    'roadmap': '/app/roadmap',
                    'interview': '/app/mock-interview'
                  }[tab] || '/app/dashboard';
                  navigate(target);
                }} />
                <RecentActivity onNavigate={(tab) => {
                  const target = {
                    'resume': '/app/resume-analyzer',
                    'job-match': '/app/job-matcher',
                    'roadmap': '/app/roadmap',
                    'interview': '/app/mock-interview'
                  }[tab] || '/app/dashboard';
                  navigate(target);
                }} />
              </div>
            } />

            <Route path="resume-analyzer" element={<ResumePage />} />
            <Route path="job-matcher" element={<JobMatchPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="mock-interview" element={<InterviewPage />} />

            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>

      </div>

    </div>
  );
};
