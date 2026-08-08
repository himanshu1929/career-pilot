import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export const RoadmapLoadingState = ({ targetRole }) => {
  const [progressPercent, setProgressPercent] = useState(12);
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    "Analyzing your current skills...",
    "Comparing skills with your target role...",
    "Identifying your biggest skill gaps...",
    "Building your learning path...",
    "Selecting practical projects...",
    "Finalizing your roadmap..."
  ];

  useEffect(() => {
    // Smooth progress bar increment timer
    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 94) return 94;
        return prev + Math.floor(Math.random() * 6) + 4;
      });
    }, 400);

    // Single rotating status message timer
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, [statusMessages.length]);

  return (
    <div className="w-full py-12 sm:py-16 flex items-center justify-center animate-fadeIn px-4">
      {/* Focused Single Loading Card (Max width 640px) */}
      <div className="w-full max-w-[640px] bg-[#161B22] border border-purple-500/30 rounded-2xl p-8 sm:p-10 text-center space-y-7 shadow-2xl transition-all duration-300">
        
        {/* Animated AI / Roadmap Icon */}
        <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400 shadow-xl">
          <Sparkles className="w-8 h-8 animate-pulse text-purple-400" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Building your learning roadmap
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-normal leading-relaxed max-w-md mx-auto">
            We're analyzing your current skills and target role to create a personalized learning path.
          </p>
        </div>

        {/* Single Smooth Progress Bar & Rotating Status Text */}
        <div className="space-y-3 pt-2 max-w-md mx-auto">
          <div className="w-full bg-[#0D1117] h-2.5 rounded-full overflow-hidden border border-[#30363D] relative">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>

          {/* Single Rotating Status Message (One Visible at a time) */}
          <div className="h-6 flex items-center justify-center">
            <p key={statusIndex} className="text-xs sm:text-sm text-purple-300 font-mono font-medium animate-fadeIn">
              {statusMessages[statusIndex]}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
