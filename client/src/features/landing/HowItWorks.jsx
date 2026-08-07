import React from 'react';
import { Upload, Sparkles, Target, Search, Map, Mic, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HowItWorks = ({ onLaunchApp }) => {
  const steps = [
    {
      stepNum: "01",
      icon: <Upload className="w-5 h-5 text-blue-500" />,
      title: "Upload Resume",
      desc: "Drop your PDF resume into CareerPilot to start automatic parsing."
    },
    {
      stepNum: "02",
      icon: <Sparkles className="w-5 h-5 text-green-500" />,
      title: "Resume Analyzer",
      desc: "See what's working on your resume and what needs fixing to score higher."
    },
    {
      stepNum: "03",
      icon: <Target className="w-5 h-5 text-blue-500" />,
      title: "Job Matcher",
      desc: "Paste any job posting to see how well your resume matches employer requirements."
    },
    {
      stepNum: "04",
      icon: <Search className="w-5 h-5 text-red-500" />,
      title: "Skill Gap Detection",
      desc: "See which keywords and technical skills you're missing for your target role."
    },
    {
      stepNum: "05",
      icon: <Map className="w-5 h-5 text-blue-500" />,
      title: "Learning Roadmap",
      desc: "Get a step-by-step learning roadmap with projects and resources to fill your gaps."
    },
    {
      stepNum: "06",
      icon: <Mic className="w-5 h-5 text-amber-500" />,
      title: "AI Mock Interview",
      desc: "Practice interview questions out loud and get instant feedback on your answers."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative z-10 border-t border-[#30363D] bg-[#0D1117] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#161B22] border border-[#30363D] text-xs font-medium text-gray-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            How CareerPilot Works
          </h2>
          <p className="mt-3 text-gray-400 text-sm sm:text-base leading-relaxed">
            Six simple steps to transform your resume, bridge skill gaps, and land your target role.
          </p>
        </div>

        {/* 6-Step Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-[#161B22] rounded p-6 border border-[#30363D] hover:border-gray-600 transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Header Row: Icon & Step Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded bg-[#0D1117] border border-[#30363D] flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-[#0D1117] border border-[#30363D] text-[11px] font-mono font-medium text-gray-400">
                    Step {s.stepNum}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white mb-2">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                  {s.desc}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#30363D] flex items-center justify-between text-xs font-mono text-gray-400">
                <span className="flex items-center gap-1 text-gray-400 text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-green-500" /> Automated Step
                </span>
                <span className="text-blue-500 font-medium inline-flex items-center gap-1 text-[11px]">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onLaunchApp}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded text-xs inline-flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <span>Start Free Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
