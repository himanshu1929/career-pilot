import React, { useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, ArrowRight, User as UserIcon } from 'lucide-react';

export const DashboardHeader = () => {
  const { workspace } = useWorkspace();
  const { user } = useAuth();
  const profile = workspace?.profile;
  const resumeHistory = workspace?.resumeHistory || [];

  const hasAnalyzedResume = resumeHistory.length > 0;

  const rawName = user?.displayName || profile?.name || 'Candidate';
  const firstName = rawName.trim().split(' ')[0] || 'Candidate';
  
  const greetingText = hasAnalyzedResume ? `Welcome back, ${firstName}` : `Welcome, ${firstName}`;

  const avatarUrl = user?.photoURL || profile?.photoURL;

  return (
    <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#30363D]">
      <div className="flex items-center gap-3.5">
        
        {/* Profile Photo Beside Greeting (44px) */}
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={firstName} 
              className="w-11 h-11 rounded-full border border-blue-500/40 object-cover shadow-sm"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-sm font-extrabold shadow-sm">
              {firstName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Header Title & Subtitle */}
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {greetingText}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Your AI career workspace.
          </p>
        </div>
      </div>
    </div>
  );
};
