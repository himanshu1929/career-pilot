import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

const LOADING_STEPS = [
  'Reading your current skills',
  'Understanding your target role',
  'Comparing with industry requirements...',
  'Detecting missing skills...',
  'Organizing learning phases...',
  'Selecting practical projects...',
  'Recommending learning resources...',
  'Estimating learning timeline...',
  'Finalizing roadmap...'
];

export const RoadmapLoadingState = ({ targetRole }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-8 space-y-8 animate-fadeIn max-w-2xl mx-auto">
      
      {/* Centered Reasoning Container Card */}
      <div className="bg-[#161B22] border border-purple-500/30 rounded-2xl p-6 sm:p-10 text-center space-y-6 shadow-2xl">
        
        {/* Animated AI Icon Header */}
        <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400 shadow-lg">
          <Sparkles className="w-8 h-8 animate-spin" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400 mb-1">
            🤖 AI Roadmap Generator
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Generating Your Personalized Learning Roadmap
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
            Our AI is analyzing your current skills, comparing them with industry expectations for <strong className="text-white">{targetRole}</strong>, identifying missing technologies, and building a personalized learning journey.
          </p>
        </div>

        {/* AI Progress Timeline Checklist */}
        <div className="space-y-2.5 max-w-md mx-auto text-left pt-2">
          {LOADING_STEPS.map((stepText, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold'
                    : isCurrent
                    ? 'bg-purple-600/20 border-purple-500/40 text-purple-200 font-extrabold animate-pulse'
                    : 'bg-[#0D1117] border-[#30363D] text-gray-500 opacity-40'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-600 flex-shrink-0" />
                )}
                <span>{stepText}</span>
              </div>
            );
          })}
        </div>

        {/* Indeterminate Animated Progress Bar */}
        <div className="pt-2">
          <div className="w-full bg-[#0D1117] h-2 rounded-full overflow-hidden border border-[#30363D]">
            <div className="bg-purple-600 h-full rounded-full animate-pulse w-full" />
          </div>
        </div>

      </div>

    </div>
  );
};
