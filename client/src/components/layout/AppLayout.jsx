import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Compass, Menu, X } from 'lucide-react';

const PATH_TITLES = {
  '/': 'Landing | CareerPilot',
  '/app/dashboard': 'Dashboard | CareerPilot',
  '/app/resume-analyzer': 'Resume Analyzer | CareerPilot',
  '/app/job-matcher': 'Job Matcher | CareerPilot',
  '/app/roadmap': 'Skill Gap & Roadmap | CareerPilot',
  '/app/mock-interview': 'AI Mock Interview | CareerPilot'
};

export const AppLayout = ({ onGoHome }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Check user preference for reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Dynamic Document Title Manager for App Routes
  useEffect(() => {
    const title = PATH_TITLES[location.pathname] || 'CareerPilot';
    document.title = title;
  }, [location.pathname]);

  // Scroll to Top instantly on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Handle client-side module navigation dispatches
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
      }
    };
    window.addEventListener('navigate_module', handleNavigate);
    return () => window.removeEventListener('navigate_module', handleNavigate);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-100 flex">
      {/* Persistent Desktop Sidebar (Static shell: never animates or re-renders on route change) */}
      <Sidebar onGoHome={onGoHome} />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0D1117]">
        
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

        {/* Dynamic Route Main Content Container — Near-Instantaneous SaaS Entrance Animation */}
        <motion.main
          key={location.pathname}
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0.98, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
          className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto bg-[#0D1117]"
        >
          <Outlet />
        </motion.main>

      </div>
    </div>
  );
};
