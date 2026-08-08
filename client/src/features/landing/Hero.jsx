import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, FileText, Target, Map, Mic, CheckCircle2, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Hero = ({ onLaunchApp }) => {
  const { user } = useAuth();

  const handleScrollToHowItWorks = (e) => {
    e.preventDefault();
    const elem = document.getElementById('how-it-works');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-[#0D1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight"
        >
          Land Your Next Job <span className="text-blue-500">with AI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          CareerPilot scores your resume against ATS filters, matches job descriptions, builds personalized learning roadmaps, and conducts interactive AI mock interviews.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onLaunchApp}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{user ? 'Continue your Journey' : 'Launch CareerPilot'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#how-it-works"
            onClick={handleScrollToHowItWorks}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#161B22] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] font-semibold rounded-xl text-sm transition-all text-center cursor-pointer"
          >
            How It Works
          </a>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left"
        >
          {/* Card 1: Resume Analyzer */}
          <motion.div 
            variants={cardVariants}
            onClick={onLaunchApp}
            className="group bg-[#161B22] hover:bg-[#1c2128] rounded-xl p-5 border border-[#30363D] hover:border-blue-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-lg bg-green-600/10 border border-green-500/20 flex items-center justify-center text-green-400 mb-4 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>Resumes</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
              Instant ATS score, formatting scan, and bullet-point improvements.
            </p>
          </motion.div>

          {/* Card 2: Job Matcher */}
          <motion.div 
            variants={cardVariants}
            onClick={onLaunchApp}
            className="group bg-[#161B22] hover:bg-[#1c2128] rounded-xl p-5 border border-[#30363D] hover:border-blue-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>Job Matcher</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
              Match your resume against job postings to uncover missing keywords.
            </p>
          </motion.div>

          {/* Card 3: Skill Gap & Roadmap */}
          <motion.div 
            variants={cardVariants}
            onClick={onLaunchApp}
            className="group bg-[#161B22] hover:bg-[#1c2128] rounded-xl p-5 border border-[#30363D] hover:border-blue-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>Skill Gap Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
              Step-by-step personalized learning paths for any target role.
            </p>
          </motion.div>

          {/* Card 4: AI Mock Interview */}
          <motion.div 
            variants={cardVariants}
            onClick={onLaunchApp}
            className="group bg-[#161B22] hover:bg-[#1c2128] rounded-xl p-5 border border-[#30363D] hover:border-blue-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>AI Mock Interview</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
              Practice technical and behavioral questions with real-time feedback.
            </p>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};
