import React from 'react';
import { GraduationCap, Briefcase, Award, CheckCircle, Sparkles, ShieldCheck, Cpu, Target, Map, FileCheck } from 'lucide-react';

export const About = () => {
  const targetAudience = [
    {
      icon: <GraduationCap className="w-6 h-6 text-cyan-400" />,
      title: "College Students",
      desc: "Prepare for campus placements and summer internships with instant resume scoring and mock practice."
    },
    {
      icon: <Award className="w-6 h-6 text-indigo-400" />,
      title: "Fresh Graduates",
      desc: "Bridge the gap between class projects and real job requirements with step-by-step roadmaps."
    },
    {
      icon: <Briefcase className="w-6 h-6 text-purple-400" />,
      title: "Job Seekers",
      desc: "Target specific job postings by matching your skills and fixing resume weaknesses."
    }
  ];

  const truthfulHighlights = [
    { icon: <Cpu className="w-5 h-5 text-indigo-400" />, label: "Google Gemini AI" },
    { icon: <FileCheck className="w-5 h-5 text-cyan-400" />, label: "Resume Version Tracking" },
    { icon: <CheckCircle className="w-5 h-5 text-emerald-400" />, label: "ATS Resume Analysis" },
    { icon: <Target className="w-5 h-5 text-rose-400" />, label: "Job Matching" },
    { icon: <ShieldCheck className="w-5 h-5 text-violet-400" />, label: "Skill Gap Detection" },
    { icon: <Map className="w-5 h-5 text-amber-400" />, label: "Personalized Roadmaps" }
  ];

  return (
    <section id="about" className="py-24 relative z-10 border-t border-white/5 bg-slate-950/40 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Answers "Who is it for?" */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>For Job Seekers</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Built for students and job seekers.
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              Navigating job applications shouldn't require expensive career coaches. CareerPilot gives you instant, practical AI feedback to get hired faster.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-slate-200">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Instant feedback based on real hiring manager criteria</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span>Step-by-step guidance tailored to your dream role</span>
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span>100% free with instant interactive demo mode</span>
              </div>
            </div>
          </div>

          {/* Truthful Product Highlights Grid (Replaces Fake Numbers like 94%, 3.5x, 10k+) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {truthfulHighlights.map((hl, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-3.5 hover:border-indigo-500/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0">
                  {hl.icon}
                </div>
                <div className="text-sm font-bold text-white leading-snug">
                  ✓ {hl.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Target Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {targetAudience.map((aud, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center mb-4">
                {aud.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{aud.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{aud.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
