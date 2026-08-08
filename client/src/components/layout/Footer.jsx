import React from 'react';
import { Compass, Sparkles, ArrowUp } from 'lucide-react';
import { CareerPilotLogo } from '../common/CareerPilotLogo';

export const Footer = ({ onNavigateApp }) => {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const quickLinks = [
    { label: "Resumes", target: "features" },
    { label: "Job Matcher", target: "features" },
    { label: "Skill Gap & Roadmap", target: "features" },
    { label: "AI Mock Interview", target: "features" }
  ];

  const builtWithTech = [
    "React",
    "Vite",
    "Node.js",
    "Express",
    "Firebase",
    "Google Gemini"
  ];

  return (
    <footer className="border-t border-[#30363D] py-12 relative z-10 bg-[#0D1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <CareerPilotLogo 
              size={36} 
              onClick={handleScrollTop} 
              wordmarkClassName="text-lg font-bold tracking-tight"
            />

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Your AI career copilot. Score your resume, match job descriptions, follow custom skill roadmaps, and practice mock interviews.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={`#${link.target}`} 
                    onClick={(e) => handleNavClick(e, link.target)} 
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-blue-500" /> {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Built With Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Built With</h4>
            <div className="flex flex-wrap gap-1.5">
              {builtWithTech.map((tech, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 rounded bg-[#161B22] border border-[#30363D] text-[10px] font-mono text-gray-400 font-medium hover:border-gray-600 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="pt-6 border-t border-[#30363D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            © 2026 CareerPilot AI. All rights reserved.
          </div>

          <button
            onClick={handleScrollTop}
            aria-label="Scroll to top of page"
            className="px-3 py-1.5 bg-[#161B22] hover:bg-[#21262d] text-xs font-medium text-gray-300 hover:text-white rounded flex items-center gap-1.5 border border-[#30363D] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-blue-500" />
          </button>
        </div>

      </div>
    </footer>
  );
};
