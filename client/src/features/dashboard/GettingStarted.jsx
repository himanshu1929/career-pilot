import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { FileText, Target, Map, Mic, ArrowRight, Sparkles } from 'lucide-react';

export const GettingStarted = ({ onNavigate }) => {
  const { workspace } = useWorkspace();
  const resumeHistory = workspace?.resumeHistory || [];

  // Automatically hide after the user completes their first resume analysis
  if (resumeHistory.length > 0) {
    return null;
  }

  const steps = [
    {
      num: 1,
      title: 'Analyze Resume',
      desc: 'Scan ATS score & extract key skills',
      icon: FileText,
      target: 'resume',
      highlight: true
    },
    {
      num: 2,
      title: 'Match Job Description',
      desc: 'Compare skills against target job postings',
      icon: Target,
      target: 'job-match',
      highlight: false
    },
    {
      num: 3,
      title: 'Generate Learning Roadmap',
      desc: 'Build personalized step-by-step curriculum',
      icon: Map,
      target: 'roadmap',
      highlight: false
    },
    {
      num: 4,
      title: 'Practice Mock Interview',
      desc: 'Conduct interactive voice & text AI interviews',
      icon: Mic,
      target: 'interview',
      highlight: false
    }
  ];

  return (
    <div className="bg-[#161B22] rounded-xl p-5 border border-[#30363D] my-6 shadow-sm">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#30363D]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">Getting Started</h3>
        </div>
        <span className="text-xs text-gray-400 font-mono">4-Step Journey</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              onClick={() => onNavigate(step.target)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-2 group ${
                step.highlight
                  ? 'bg-blue-600/10 border-blue-500/50 hover:border-blue-400 shadow-sm hover:shadow-blue-500/10'
                  : 'bg-[#0D1117] border-[#30363D] hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${step.highlight ? 'bg-blue-600 text-white' : 'bg-[#161B22] text-gray-400 border border-[#30363D]'}`}>
                  Step {step.num}
                </span>
                <Icon className={`w-4 h-4 ${step.highlight ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
              </div>

              <div>
                <h4 className="text-xs font-bold text-white flex items-center justify-between group-hover:text-blue-400 transition-colors">
                  <span>{step.title}</span>
                  <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
