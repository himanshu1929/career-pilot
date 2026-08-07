import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  FileText, 
  Target, 
  Map, 
  Video, 
  Trophy, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Compass
} from 'lucide-react';

export const CareerJourneyStepper = () => {
  const { journeyState } = useWorkspace();
  const navigate = useNavigate();

  const { steps, currentStepIndex, currentRecommendedStep } = journeyState;

  const getStepIcon = (id, isCompleted, isCurrent) => {
    const iconClass = isCompleted 
      ? 'w-5 h-5 text-emerald-400' 
      : (isCurrent ? 'w-5 h-5 text-blue-400' : 'w-5 h-5 text-slate-500');

    switch (id) {
      case 'resume': return <FileText className={iconClass} />;
      case 'jobMatch': return <Target className={iconClass} />;
      case 'roadmap': return <Map className={iconClass} />;
      case 'interview': return <Video className={iconClass} />;
      default: return <Trophy className={iconClass} />;
    }
  };

  const primary4Steps = steps.slice(0, 4);

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-600/10 border border-blue-500/30 text-xs font-semibold text-blue-400 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Guided AI Career Coaching</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Career Preparation Journey</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Follow the recommended AI mentor workflow to maximize your interview callback rate.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-[#0D1117] px-3 py-1.5 rounded-xl border border-[#30363D] self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Stage {Math.min(currentStepIndex + 1, 4)} of 4</span>
        </div>
      </div>

      {/* Responsive Journey Stepper Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 relative">
        {primary4Steps.map((step, idx) => {
          const isCompleted = step.completed;
          const isCurrent = idx === currentStepIndex || (currentStepIndex >= 4 && idx === 3);

          return (
            <div
              key={step.id}
              onClick={() => navigate(step.route)}
              className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                isCurrent
                  ? 'bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                  : (isCompleted 
                      ? 'bg-[#0D1117] border-emerald-500/30 hover:border-emerald-500/50' 
                      : 'bg-[#0D1117]/60 border-[#30363D] opacity-75 hover:opacity-100 hover:border-gray-500')
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  isCompleted 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : (isCurrent ? 'bg-blue-600/20 border-blue-500/30' : 'bg-gray-800/50 border-gray-700')
                }`}>
                  {getStepIcon(step.id, isCompleted, isCurrent)}
                </div>

                {isCompleted ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Done
                  </span>
                ) : isCurrent ? (
                  <span className="text-[10px] font-extrabold text-blue-400 bg-blue-600/20 px-2 py-0.5 rounded-full border border-blue-500/30 animate-pulse">
                    Next Step
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-gray-500">
                    Step {step.stepNum}
                  </span>
                )}
              </div>

              <div>
                <h4 className={`text-xs font-bold ${isCurrent ? 'text-white font-extrabold' : (isCompleted ? 'text-gray-200' : 'text-gray-400')}`}>
                  {step.title}
                </h4>
                <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prominent "Recommended Next Step" Action Box */}
      {currentRecommendedStep && (
        <div className="p-5 rounded-xl bg-[#0D1117] border border-blue-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 bg-blue-600/20 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
                ⭐ Recommended Next Step
              </span>
              <span className="text-xs text-gray-400 font-mono">Stage {currentRecommendedStep.stepNum}</span>
            </div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              {currentRecommendedStep.title}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
              {currentRecommendedStep.description}
            </p>
          </div>

          <button
            onClick={() => navigate(currentRecommendedStep.route)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer flex-shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{currentRecommendedStep.buttonLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
