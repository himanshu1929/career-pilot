import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Target, Map, Mic, BarChart2, Zap, ArrowRight } from 'lucide-react';

export const Features = () => {
  const featureList = [
    {
      icon: <FileText className="w-6 h-6 text-indigo-400" />,
      title: "Resume Analyzer",
      description: "See what's working on your resume and what needs fixing to get more callbacks.",
      gradient: "from-indigo-500/20 to-purple-500/5",
      badge: "Gemini Powered"
    },
    {
      icon: <Target className="w-6 h-6 text-cyan-400" />,
      title: "Job Matcher",
      description: "See which skills match the job description and which ones you're currently missing.",
      gradient: "from-cyan-500/20 to-blue-500/5",
      badge: "Smart Comparison"
    },
    {
      icon: <Map className="w-6 h-6 text-emerald-400" />,
      title: "Skill Gap & Roadmap",
      description: "Get a step-by-step learning roadmap tailored to your dream software role.",
      gradient: "from-emerald-500/20 to-teal-500/5",
      badge: "Custom Roadmap"
    },
    {
      icon: <Mic className="w-6 h-6 text-violet-400" />,
      title: "AI Mock Interview",
      description: "Practice real technical and behavioral questions with instant feedback on your answers.",
      gradient: "from-violet-500/20 to-pink-500/5",
      badge: "Real-time Q&A"
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-amber-400" />,
      title: "Career Dashboard",
      description: "Track your resume scores, job application readiness, and roadmap completion in one view.",
      gradient: "from-amber-500/20 to-orange-500/5",
      badge: "Live Tracking"
    },
    {
      icon: <Zap className="w-6 h-6 text-rose-400" />,
      title: "Interactive Demo",
      description: "Try pre-populated sample data instantly without needing to upload your own resume first.",
      gradient: "from-rose-500/20 to-red-500/5",
      badge: "Instant Demo"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section id="features" className="py-24 relative z-10 border-t border-white/5 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - Answers "What can it do?" */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Core Features</h2>
          <p className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Find what employers are looking for.
          </p>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Stop guessing what recruiters want. Let AI analyze your experience and guide your next step.
          </p>
        </div>

        {/* Features Staggered Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featureList.map((feat, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="glass-card rounded-2xl p-8 border border-white/10 relative overflow-hidden group hover:border-indigo-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Background Accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feat.gradient} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`} />

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-white/15 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    {feat.icon}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 border border-white/10 text-slate-300 shadow-sm">
                    {feat.badge}
                  </span>
                </div>

                {/* Body */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {feat.description}
                </p>
              </div>

              {/* Link Arrow */}
              <div className="flex items-center text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors gap-1 relative z-10">
                <span>Explore feature</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
