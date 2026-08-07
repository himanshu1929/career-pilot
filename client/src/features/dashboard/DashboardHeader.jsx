import React, { useState, useEffect } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Plus } from 'lucide-react';
import { mockDashboardData } from '../../utils/mockData';

export const DashboardHeader = ({ onActionClick }) => {
  const { profile } = useProfile();
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    try {
      const visited = localStorage.getItem('career_pilot_has_visited_dashboard');
      if (visited) {
        setIsReturning(true);
      } else {
        localStorage.setItem('career_pilot_has_visited_dashboard', 'true');
        setIsReturning(false);
      }
    } catch (e) {
      setIsReturning(false);
    }
  }, []);

  const displayName = profile?.name ? profile.name.trim() : '';
  
  let greetingText;
  if (displayName) {
    greetingText = isReturning ? `Welcome back, ${displayName} 👋` : `Welcome, ${displayName} 👋`;
  } else {
    greetingText = isReturning ? 'Welcome back 👋' : 'Welcome 👋';
  }

  const targetGoal = profile?.goal || mockDashboardData.user.targetRole;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#30363D]">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Profile Active
          </span>
          <span className="text-xs text-gray-400">Target Goal: <strong className="text-white">{targetGoal}</strong></span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {greetingText}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Here is your AI career readiness report and active learning milestones.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onActionClick('resume')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Resume Scan</span>
        </button>
      </div>
    </div>
  );
};
