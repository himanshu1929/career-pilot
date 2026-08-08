import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Circle, Trophy, ArrowRight } from 'lucide-react';

export const CareerJourneyProgress = ({ onNavigate }) => {
  const { workspace, computedStats } = useWorkspace();
  const { user } = useAuth();
  const profile = workspace?.profile;

  const resumeCount = computedStats?.resumeCount || 0;
  const totalJobMatches = computedStats?.totalJobMatches || 0;
  const roadmaps = workspace?.roadmaps || [];
  const interviewCount = computedStats?.interviewCount || 0;
  const overallCareerScore = computedStats?.overallCareerScore || 0;

  const isScoreUnlocked = resumeCount > 0 && totalJobMatches > 0 && roadmaps.length > 0 && interviewCount > 0;

  const steps = [
    {
      id: 'resume',
      label: 'Resume Analysis Completed',
      completed: resumeCount > 0,
      navTarget: 'resume'
    },
    {
      id: 'job-match',
      label: 'Job Match Completed',
      completed: totalJobMatches > 0,
      navTarget: 'job-match'
    },
    {
      id: 'roadmap',
      label: 'Skill Roadmap Generated',
      completed: roadmaps.length > 0,
      navTarget: 'roadmap'
    },
    {
      id: 'interview',
      label: 'First Mock Interview Completed',
      completed: interviewCount > 0,
      navTarget: 'interview'
    },
    {
      id: 'score',
      label: 'Career Score Unlocked',
      completed: isScoreUnlocked || (resumeCount > 0 && overallCareerScore > 0),
      navTarget: 'resume'
    }
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-[#161B22] rounded-xl p-5 border border-[#30363D] my-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#30363D]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Career Journey</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                {progressPercent}% Completed
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Complete these milestones to unlock your Career Score.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-48 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>{completedCount} of {steps.length} Milestones</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#0D1117] h-2 rounded-full overflow-hidden border border-[#30363D]">
            <div 
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Step Pills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-4">
        {steps.map((step) => (
          <div
            key={step.id}
            onClick={() => step.navTarget && onNavigate(step.navTarget)}
            className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 transition-all ${
              step.completed
                ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-300 font-medium'
                : 'bg-[#0D1117] border-[#30363D] text-gray-400 hover:border-gray-500'
            } ${step.navTarget ? 'cursor-pointer hover:bg-[#1f242c]' : 'cursor-default'}`}
            title={step.completed ? `Completed: ${step.label}` : `Click to complete ${step.label}`}
          >
            {step.completed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-gray-500 flex-shrink-0" />
            )}
            <span className="truncate">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Section 6 Empty State Guidance */}
      {completedCount === 0 && (
        <div className="mt-4 pt-3.5 border-t border-[#30363D]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-400">
          <span>Start by analyzing your first resume to begin building your AI career profile.</span>
          <button
            onClick={() => onNavigate('resume')}
            className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Analyze First Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
