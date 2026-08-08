import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageContainer';

export const JobMatcherLoadingState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);
  const [statusIndex, setStatusIndex] = useState(0);

  const checklist = [
    "Extracting job requirements",
    "Identifying required technical skills",
    "Comparing resume with job description",
    "Calculating ATS compatibility",
    "Generating improvement recommendations"
  ];

  const rotatingMessages = [
    "Finding missing keywords...",
    "Evaluating technical alignment...",
    "Scoring ATS compatibility...",
    "Building recommendations..."
  ];

  useEffect(() => {
    // Step progression timer
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < checklist.length - 1 ? prev + 1 : prev));
    }, 1400);

    // Smooth progress bar timer
    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 92) return 92;
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 350);

    // Rotating status message timer
    const messageInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % rotatingMessages.length);
    }, 1800);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Standardized Page Header */}
      <PageHeader
        title="Job Matcher"
        subtitle="Compare your resume against any job description."
        backTo="/app/dashboard"
        backLabel="Back to Dashboard"
      />

      {/* State 2: Focused Loading Card ONLY (Width: 500-650px / max-w-xl) */}
      <div className="max-w-xl mx-auto bg-[#161B22] border border-blue-500/30 rounded-2xl p-7 sm:p-9 text-center space-y-6 shadow-2xl transition-all duration-300">
        
        {/* Animated AI Icon */}
        <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400 shadow-md">
          <Sparkles className="w-7 h-7 animate-spin" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Analyzing Resume Against Job Description
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-normal">
            This usually takes 5–10 seconds.
          </p>
        </div>

        {/* Vertical Checklist */}
        <div className="space-y-2.5 max-w-md mx-auto text-left pt-2">
          {checklist.map((itemText, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold'
                    : isCurrent
                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-200 font-extrabold animate-pulse'
                    : 'bg-[#0D1117] border-[#30363D] text-gray-500 opacity-50'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-600 flex-shrink-0 opacity-40" />
                )}
                <span>
                  {isDone ? `✓ ${itemText}` : isCurrent ? `⏳ ${itemText}` : `○ ${itemText}`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Subtle Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="w-full bg-[#0D1117] h-2 rounded-full overflow-hidden border border-[#30363D] relative">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>

          {/* Rotating Status Message */}
          <div className="h-5 flex items-center justify-center">
            <p className="text-xs text-blue-400 font-mono font-medium animate-fadeIn key={statusIndex}">
              {rotatingMessages[statusIndex]}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
