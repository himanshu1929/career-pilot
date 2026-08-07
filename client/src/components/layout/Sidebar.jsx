import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { 
  LayoutDashboard, 
  FileText, 
  Target, 
  Map, 
  Mic, 
  Compass, 
  LogOut,
  RotateCcw,
  User
} from 'lucide-react';
import { mockDashboardData } from '../../utils/mockData';

export const Sidebar = ({ onGoHome }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, resetProfile } = useProfile();

  const menuItems = [
    { 
      id: 'dashboard',
      path: '/app/dashboard',
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      activeColor: 'text-blue-500',
      activeBg: 'bg-blue-500/10 border-blue-500/30'
    },
    { 
      id: 'resume', 
      path: '/app/resume-analyzer',
      label: 'Resume Analyzer', 
      icon: FileText, 
      activeColor: 'text-green-500',
      activeBg: 'bg-green-500/10 border-green-500/30'
    },
    { 
      id: 'job-match', 
      path: '/app/job-matcher',
      label: 'Job Matcher', 
      icon: Target, 
      activeColor: 'text-blue-500',
      activeBg: 'bg-blue-500/10 border-blue-500/30'
    },
    { 
      id: 'roadmap', 
      path: '/app/roadmap',
      label: 'Skill Gap & Roadmap', 
      icon: Map, 
      activeColor: 'text-blue-500',
      activeBg: 'bg-blue-500/10 border-blue-500/30'
    },
    { 
      id: 'interview', 
      path: '/app/mock-interview',
      label: 'AI Mock Interview', 
      icon: Mic, 
      activeColor: 'text-amber-500',
      activeBg: 'bg-amber-500/10 border-amber-500/30'
    },
  ];

  const handleResetWorkspace = () => {
    resetProfile();
    navigate('/welcome', { replace: true });
  };

  const displayName = profile?.name || 'Career Pilot User';
  const displayRole = profile?.experience || profile?.goal || 'Free Workspace';

  return (
    <aside className="w-64 bg-[#0D1117] border-r border-[#30363D] flex flex-col justify-between h-screen sticky top-0 z-40 hidden md:flex">
      
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-[#30363D] flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
            <div className="w-8 h-8 rounded bg-[#161B22] border border-[#30363D] flex items-center justify-center">
              <Compass className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-base font-semibold tracking-tight text-white">
              Career<span className="text-blue-500 font-bold">Pilot</span>
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161B22] text-gray-400 border border-[#30363D]">
            v1.0
          </span>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-6 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Platform Navigation
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? `${item.activeBg} text-white border`
                    : 'text-gray-400 hover:text-white hover:bg-[#161B22] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? item.activeColor : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Profile & Exit */}
      <div className="p-4 border-t border-[#30363D] space-y-2.5">
        {/* User Profile Card */}
        <div className="p-3 rounded bg-[#161B22] border border-[#30363D] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate" title={displayName}>
              {displayName}
            </div>
            <div className="text-[10px] text-gray-400 truncate" title={displayRole}>
              {displayRole}
            </div>
          </div>
        </div>

        {/* Reset Workspace Option */}
        <button
          onClick={handleResetWorkspace}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-gray-400 hover:text-amber-400 hover:bg-[#161B22] rounded transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Workspace</span>
        </button>

        {/* Exit Workspace */}
        <button
          onClick={onGoHome}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-gray-400 hover:text-white hover:bg-[#161B22] rounded transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Workspace</span>
        </button>
      </div>

    </aside>
  );
};
