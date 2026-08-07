import React from 'react';
import { FileText, Target, Map, Mic, ArrowRight } from 'lucide-react';
import { mockDashboardData } from '../../utils/mockData';

export const QuickActions = ({ onNavigate }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-6 h-6" />;
      case 'Target': return <Target className="w-6 h-6" />;
      case 'Map': return <Map className="w-6 h-6" />;
      case 'Mic': return <Mic className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Quick Actions</h2>
        <span className="text-xs text-slate-400">Select a tool to launch</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockDashboardData.quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onNavigate(action.id)}
            className={`glass-card glass-card-hover text-left rounded-2xl p-5 border ${action.border} relative overflow-hidden group transition-all duration-300`}
          >
            <div className={`w-12 h-12 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center mb-4 ${action.accent}`}>
              {getIcon(action.icon)}
            </div>

            <h3 className="text-base font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors flex items-center justify-between">
              <span>{action.title}</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all" />
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              {action.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
