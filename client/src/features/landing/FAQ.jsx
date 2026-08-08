import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Plus, MessageSquare } from 'lucide-react';

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "Is CareerPilot free to use?",
      a: "Yes! You can analyze resumes, match job descriptions, generate learning roadmaps, and practice AI mock interviews completely free with our built-in interactive demo mode and instant sample analysis tools."
    },
    {
      q: "Which resume formats are supported?",
      a: "Simply upload your resume in PDF format."
    },
    {
      q: "How does CareerPilot help me pass ATS filters?",
      a: "CareerPilot scans your resume against real recruiter Applicant Tracking System (ATS) criteria. It pinpoint formatting errors, weak action verbs, and missing job keywords so you can fix them before applying."
    },
    {
      q: "Do I need to re-upload my resume for every feature?",
      a: "No! Once you analyze a resume, it automatically becomes your active workspace resume. Moving to Job Matcher, Learning Roadmap, or Mock Interview reuses that resume so you never have to upload it again."
    },
    {
      q: "Can I compare an updated resume with an older version?",
      a: "Yes! When you upload a revised version of a resume, CareerPilot's built-in comparison feature shows a side-by-side breakdown tracking your score increases, resolved weaknesses, and newly added keywords."
    },
    {
      q: "Are my uploaded resumes and personal details secure?",
      a: "Yes. CareerPilot protects your privacy using secure Firebase Authentication and Cloud Firestore encryption. Your data is strictly linked to your private account and is never shared or sold."
    }
  ];

  return (
    <section id="faq" className="py-24 relative z-10 border-t border-[#30363D] bg-[#0D1117] scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#161B22] border border-[#30363D] text-xs font-medium text-gray-300 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>Questions & Answers</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Everything you need to know about CareerPilot, ATS parsing, and our AI evaluation engines.
          </p>
        </div>

        {/* 6 Accordions */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-[#161B22] rounded border transition-colors duration-150 overflow-hidden ${
                  isOpen ? 'border-gray-600 bg-[#1c2128]' : 'border-[#30363D] hover:border-gray-600'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className={`text-sm sm:text-base font-semibold tracking-tight ${isOpen ? 'text-white' : 'text-gray-300'}`}>
                    {faq.q}
                  </span>
                  
                  {/* Plus Icon rotates into X */}
                  <div className={`w-7 h-7 rounded flex items-center justify-center transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 rotate-45' : 'bg-[#0D1117] text-gray-400 border border-[#30363D]'
                  }`}>
                    <Plus className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div 
                      id={`faq-answer-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-[#30363D] pt-3">
                        <p className="bg-[#0D1117] p-3.5 rounded border border-[#30363D] leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Footer Support Banner */}
        <div className="mt-12 text-center p-5 rounded bg-[#161B22] border border-[#30363D] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded bg-[#0D1117] border border-[#30363D] flex items-center justify-center text-blue-500">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Have a specific question?</div>
              <div className="text-[11px] text-gray-400">Explore the interactive demo or check our documentation.</div>
            </div>
          </div>

          <a 
            href="#features" 
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Explore Core Features
          </a>
        </div>

      </div>
    </section>
  );
};
