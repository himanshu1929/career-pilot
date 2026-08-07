import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';

export const CTA = ({ onLaunchApp }) => {
  return (
    <section className="py-20 relative z-10 bg-[#0D1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-[#161B22] border border-[#30363D] p-8 sm:p-14 text-center shadow-xl">
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            {/* Logo Mark */}
            <div className="w-12 h-12 rounded-xl bg-[#0D1117] border border-[#30363D] mx-auto flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6 text-blue-500" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Ready to land your dream role with AI?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
              Start analyzing your resume, matching job descriptions, and practicing mock interviews for free.
            </p>

            <div className="flex justify-center pt-2">
              <button
                onClick={onLaunchApp}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Launch CareerPilot App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 font-mono">
              No credit card required • Instant AI Analysis • Personalized Career Guidance
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
