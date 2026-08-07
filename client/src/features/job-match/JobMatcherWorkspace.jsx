import React, { useState, useEffect } from 'react';
import { Target, FileText, Sparkles, ArrowRight, Briefcase, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ResumeUploader } from '../resume/ResumeUploader';
import { useWorkspace } from '../../context/WorkspaceContext';

export const JobMatcherWorkspace = ({ onAnalyzeMatch, analyzing, initialResumeFile }) => {
  const { profile } = useWorkspace();
  const [resumeFile, setResumeFile] = useState(initialResumeFile || null);

  const isPlatformObjective = (str) => {
    if (!str) return true;
    const lower = str.toLowerCase();
    return lower.includes('get a job') || lower.includes('learn new skills') || lower.includes('improve my resume') || lower.includes('prepare for interview');
  };

  const initialRole = (!isPlatformObjective(profile?.targetRole) && profile?.targetRole) || (!isPlatformObjective(profile?.role) && profile?.role) || '';
  const [jobTitle, setJobTitle] = useState(initialRole);
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (initialResumeFile && (initialResumeFile instanceof File || initialResumeFile instanceof Blob)) {
      setResumeFile(initialResumeFile);
    }
  }, [initialResumeFile]);

  // User interaction tracking flags
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [resumeTouched, setResumeTouched] = useState(false);
  const [jobTitleTouched, setJobTitleTouched] = useState(false);
  const [jobDescTouched, setJobDescTouched] = useState(false);

  // Field validation logic (Job Title is mandatory)
  const isResumeValid = Boolean(resumeFile);
  const isJobTitleValid = Boolean(jobTitle && jobTitle.trim().length >= 2);
  const isJobDescriptionValid = Boolean(jobDescription && jobDescription.trim().length >= 10);
  const isFormValid = isResumeValid && isJobTitleValid && isJobDescriptionValid;

  const showResumeError = !isResumeValid && (hasSubmitted || resumeTouched);
  const showJobTitleError = !isJobTitleValid && (hasSubmitted || jobTitleTouched);
  const showJobDescError = !isJobDescriptionValid && (hasSubmitted || jobDescTouched);

  // Loading progress steps
  const loadingSteps = [
    'Reading Resume',
    'Extracting Skills',
    'Understanding Job Description',
    'Comparing Skills',
    'Calculating Match',
    'Generating Recommendations'
  ];

  useEffect(() => {
    let interval;
    if (analyzing) {
      setCurrentStep(0);
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 600);
    } else {
      setCurrentStep(0);
    }
    return () => clearInterval(interval);
  }, [analyzing]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (analyzing) return;

    setHasSubmitted(true);
    if (!isFormValid) return;

    if (!(resumeFile instanceof File)) {
      setResumeTouched(true);
      return;
    }

    if (onAnalyzeMatch) {
      onAnalyzeMatch({
        resumeFile,
        jobTitle: jobTitle.trim() || 'Target Position',
        companyName: companyName.trim(),
        jobDescription: jobDescription.trim()
      });
    }
  };

  const jobDescriptionPlaceholder = `Paste the complete job posting text here...

Example:
Frontend Developer (React / TypeScript)

Requirements:
• 3+ years experience with React.js & TypeScript
• State management (Redux / Context API)
• RESTful APIs and modern CSS
• Git, CI/CD, and unit testing`;

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      
      {/* Standardized Left-Aligned Header (Matching Skill Gap & Roadmap / Resume Analyzer 1:1) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#30363D]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>AI Job Description Matcher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Job Description Matcher
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Compare your resume directly against target job postings to uncover missing ATS keywords, skill gaps, and custom tailoring advice.
          </p>
        </div>
      </div>

      {/* Processing State: Progress Steps Loading Indicator */}
      {analyzing ? (
        <div className="space-y-8 animate-fadeIn" role="status" aria-live="polite">
          <div className="bg-[#161B22] border border-blue-500/30 rounded-2xl p-6 sm:p-8 text-center max-w-xl mx-auto shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-5 text-blue-400">
              <Sparkles className="w-7 h-7 animate-spin" />
            </div>

            <h3 className="text-lg font-extrabold text-white mb-4 tracking-tight">
              Analyzing Job Description Alignment...
            </h3>

            {/* 6 Step Indicators */}
            <div className="space-y-2.5 max-w-sm mx-auto text-left">
              {loadingSteps.map((stepText, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all duration-300 ${
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
                      <div className="w-4 h-4 rounded-full border border-gray-600 flex-shrink-0" />
                    )}
                    <span>{stepText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Linear Dashboard Form matching Skill Gap & Roadmap */
        <form onSubmit={handleFormSubmit} className="space-y-6" aria-label="Job Matcher Form">
          
          {/* SECTION 1: Resume PDF Selection */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 pb-3 border-b border-[#30363D]">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">1. Candidate Resume PDF</h3>
                <p className="text-xs text-gray-400">Upload your resume to compare against target qualifications</p>
              </div>
            </div>

            <ResumeUploader 
              initialFile={initialResumeFile}
              onUploadComplete={(file) => {
                setResumeFile(file);
                setResumeTouched(true);
              }} 
            />

            {showResumeError && (
              <div className="flex items-center gap-2 text-rose-400 text-xs font-medium pt-1 animate-fadeIn" role="alert">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Please upload a PDF resume.</span>
              </div>
            )}
          </div>

          {/* SECTION 2: Target Job Description Input */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 pb-3 border-b border-[#30363D]">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">2. Target Job Posting</h3>
                <p className="text-xs text-gray-400">Paste the complete job description details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Target Job Title (Mandatory) */}
              <div className="space-y-2">
                <label htmlFor="target-job-title" className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                  Target Job Title <span className="text-rose-400 font-bold">*</span>
                </label>
                <input
                  id="target-job-title"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => {
                    setJobTitle(e.target.value);
                    setJobTitleTouched(true);
                  }}
                  onBlur={() => setJobTitleTouched(true)}
                  placeholder="e.g. Senior Frontend Engineer..."
                  disabled={analyzing}
                  className={`w-full px-4 py-3 rounded-xl bg-[#0D1117] border text-white text-sm focus:outline-none transition-colors disabled:opacity-50 ${
                    showJobTitleError ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#30363D] focus:border-blue-500'
                  }`}
                />
                {showJobTitleError && (
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-medium pt-1 animate-fadeIn" role="alert">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Target job title is required (e.g. Senior Frontend Engineer).</span>
                  </div>
                )}
              </div>

              {/* Company Name (Optional) */}
              <div className="space-y-2">
                <label htmlFor="target-company-name" className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                  Company Name <span className="text-gray-500 font-normal text-[11px]">(Optional)</span>
                </label>
                <input
                  id="target-company-name"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google, Microsoft, Meta..."
                  disabled={analyzing}
                  className="w-full px-4 py-3 rounded-xl bg-[#0D1117] border border-[#30363D] focus:border-blue-500 text-white text-sm focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="target-job-description" className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                Full Job Posting Text <span className="text-rose-400 font-bold">*</span>
              </label>
              <textarea
                id="target-job-description"
                rows={7}
                value={jobDescription}
                onBlur={() => setJobDescTouched(true)}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  if (e.target.value.trim().length >= 10) setJobDescTouched(true);
                }}
                placeholder={jobDescriptionPlaceholder}
                disabled={analyzing}
                className="w-full px-4 py-3 rounded-xl bg-[#0D1117] border border-[#30363D] text-white text-sm leading-relaxed focus:outline-none focus:border-blue-500 transition-colors font-mono disabled:opacity-50"
              />
            </div>

            {showJobDescError && (
              <div className="flex items-center gap-2 text-rose-400 text-xs font-medium pt-1 animate-fadeIn" role="alert">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Please paste the target job description text.</span>
              </div>
            )}
          </div>

          {/* Primary Action Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isFormValid || analyzing}
              className={`w-full py-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                isFormValid && !analyzing
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  : 'bg-blue-600/40 text-gray-400 border border-[#30363D] cursor-not-allowed opacity-50'
              }`}
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Analyzing Alignment...</span>
                </>
              ) : (
                <>
                  <Target className="w-5 h-5 text-blue-300" />
                  <span>Run AI Job Match Analysis</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
