import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { FileText, Target, Map, Mic, Clock, Sparkles, ArrowRight } from 'lucide-react';

export const RecentActivity = ({ onNavigate }) => {
  const { activities } = useWorkspace();

  const getActivityIcon = (type) => {
    switch (type) {
      case 'resume':
        return <FileText className="w-4 h-4 text-green-400" />;
      case 'job-match':
        return <Target className="w-4 h-4 text-blue-400" />;
      case 'roadmap':
        return <Map className="w-4 h-4 text-purple-400" />;
      case 'interview':
        return <Mic className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          Recent Workspace Activity
        </h2>
        {activities.length > 0 && (
          <span className="text-xs text-gray-400 font-mono">{activities.length} Recorded Actions</span>
        )}
      </div>

      {activities.length > 0 ? (
        <div className="bg-[#161B22] rounded-xl p-5 border border-[#30363D] space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              onClick={() => onNavigate(act.type)}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-[#0D1117] hover:bg-[#1f242c] border border-[#30363D] hover:border-gray-500 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#161B22] border border-[#30363D] flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                  {getActivityIcon(act.type)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{act.title}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${act.badgeColor}`}>
                      {act.badge}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">{act.detail}</p>
                </div>
              </div>

              <div className="text-xs text-gray-400 font-mono flex items-center gap-1.5 self-end sm:self-auto">
                <Clock className="w-3 h-3 text-gray-500" />
                <span>{act.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State Card when zero activities exist */
        <div className="bg-[#161B22] rounded-xl p-8 border border-[#30363D] text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-white tracking-tight">No recent activity yet</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Start by scanning your resume or creating your personalized career roadmap to build your profile.
            </p>
          </div>
          <button
            onClick={() => onNavigate('resume')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Scan Your First Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
