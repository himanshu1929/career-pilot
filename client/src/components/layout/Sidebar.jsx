import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
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

import { CareerPilotLogo } from '../common/CareerPilotLogo';

export const Sidebar = ({ onGoHome }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, resetProfile } = useProfile();
  const { user, login, logout } = useAuth();

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
      label: 'Resumes', 
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
      label: 'Learning Roadmap', 
      icon: Map, 
      activeColor: 'text-blue-500',
      activeBg: 'bg-blue-500/10 border-blue-500/30'
    },
    { 
      id: 'interview', 
      path: '/app/mock-interview',
      label: 'Mock Interview', 
      icon: Mic, 
      activeColor: 'text-amber-500',
      activeBg: 'bg-amber-500/10 border-amber-500/30'
    },
  ];

  const handleResetWorkspace = () => {
    resetProfile();
    navigate('/welcome', { replace: true });
  };

  const fullName = user?.displayName || profile?.name || 'CareerPilot User';
  const firstName = fullName.trim().split(' ')[0] || 'User';
  const userEmail = user?.email || profile?.email || 'Google Account';
  const avatarUrl = user?.photoURL;

  return (
    <aside className="w-64 bg-[#0D1117] border-r border-[#30363D] flex flex-col justify-between h-screen sticky top-0 z-40 hidden md:flex">
      
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-[#30363D] flex items-center justify-between">
          <CareerPilotLogo 
            size={36} 
            onClick={onGoHome} 
            wordmarkClassName="text-lg font-bold tracking-tight"
          />
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
      <div className="p-4 border-t border-[#30363D] space-y-3">
        
        {/* Google Authentication Control */}
        {user ? (
          <div className="p-3 rounded-xl bg-[#161B22] border border-[#30363D] hover:border-blue-500/50 flex items-center justify-between gap-3 shadow-sm transition-colors">
            <div 
              onClick={() => navigate('/app/profile')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
              title="View Profile"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="w-8 h-8 rounded-full border border-blue-500/40 object-cover flex-shrink-0 group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                  {firstName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate" title={fullName}>
                  {firstName}
                </div>
                <div className="text-[10px] text-gray-400 font-medium truncate" title={userEmail}>
                  {userEmail}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="text-gray-400 hover:text-rose-400 p-1.5 hover:bg-[#21262d] rounded-lg transition-colors cursor-pointer flex-shrink-0"
              title="Sign Out of Google"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="w-full p-2.5 rounded-xl bg-[#161B22] hover:bg-[#21262d] border border-[#30363D] hover:border-blue-500/50 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        )}

        {/* Action Controls Divider */}
        <div className="pt-1 border-t border-[#30363D]/60 space-y-1">
          {/* Clear Local Data Option */}
          <button
            onClick={handleResetWorkspace}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-gray-400 hover:text-amber-400 hover:bg-[#161B22] rounded-lg transition-colors cursor-pointer"
            title="Clear all stored workspace history and profile data from local storage"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-400" />
            <span>Clear Local Data</span>
          </button>

          {/* Sign Out Option */}
          <button
            onClick={() => {
              if (user) logout();
              onGoHome();
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

    </aside>
  );
};
