import React, { useState, useEffect } from 'react';
import { Target, FileText, Sparkles, ArrowRight, Briefcase, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ResumeUploader } from '../resume/ResumeUploader';
import { useWorkspace } from '../../context/WorkspaceContext';
import { PageHeader } from '../../components/layout/PageContainer';

export const JobMatcherWorkspace = ({ onAnalyzeMatch, analyzing, initialResumeFile }) => {
  const { profile, activeResumeAnalysis, activeResumeFile } = useWorkspace();
  const [resumeFile, setResumeFile] = useState(initialResumeFile || activeResumeFile || null);
  const [isChangingResume, setIsChangingResume] = useState(false);

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
    } else if (activeResumeFile && (activeResumeFile instanceof File || activeResumeFile instanceof Blob)) {
      setResumeFile(activeResumeFile);
    }
  }, [initialResumeFile, activeResumeFile]);

  // Helper to retrieve effective value considering DOM input for browser autofill synchronization
  const getEffectiveJobTitle = () => {
    if (jobTitle && jobTitle.trim()) return jobTitle.trim();
    if (typeof document !== 'undefined') {
      const el = document.getElementById('target-job-title');
      if (el && el.value && el.value.trim()) return el.value.trim();
    }
    return '';
  };

  const getEffectiveCompanyName = () => {
    if (companyName && companyName.trim()) return companyName.trim();
    if (typeof document !== 'undefined') {
      const el = document.getElementById('target-company-name');
      if (el && el.value && el.value.trim()) return el.value.trim();
    }
    return '';
  };

  const getEffectiveJobDescription = () => {
    if (jobDescription && jobDescription.trim()) return jobDescription.trim();
    if (typeof document !== 'undefined') {
      const el = document.getElementById('target-job-description') || document.getElementById('job-description-input');
      if (el && el.value && el.value.trim()) return el.value.trim();
    }
    return '';
  };

  // User interaction tracking flags
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [resumeTouched, setResumeTouched] = useState(false);
  const [jobTitleTouched, setJobTitleTouched] = useState(false);
  const [jobDescTouched, setJobDescTouched] = useState(false);

  // Synchronize state from DOM elements on interval / blur to catch browser autofill
  const handleJobTitleInputChange = (e) => {
    const val = e.target.value;
    setJobTitle(val);
    setJobTitleTouched(true);
  };

  const handleCompanyNameInputChange = (e) => {
    setCompanyName(e.target.value);
  };

  const handleJobDescInputChange = (e) => {
    setJobDescription(e.target.value);
    setJobDescTouched(true);
  };

  // Field validation logic (Job Title & Job Description checked against effective DOM & State values)
  const effectiveTitle = getEffectiveJobTitle();
  const effectiveDesc = getEffectiveJobDescription();

  const isResumeValid = Boolean(resumeFile || activeResumeFile || activeResumeAnalysis);
  const isJobTitleValid = Boolean(effectiveTitle && effectiveTitle.length >= 2);
  const isJobDescriptionValid = Boolean(effectiveDesc && effectiveDesc.length >= 10);
  const isFormValid = isResumeValid && isJobTitleValid && isJobDescriptionValid;

  const showResumeError = !isResumeValid && (hasSubmitted || resumeTouched);
  const showJobTitleError = !isJobTitleValid && (hasSubmitted || jobTitleTouched);
  const showJobDescError = !isJobDescriptionValid && (hasSubmitted || jobDescTouched);

  // Loading progress steps
  const loadingSteps = [
    'Scanning target job description requirements...',
    'Extracting required technical skills & experience levels...',
    'Comparing resume content against job keywords...',
    'Generating tailored ATS match analysis report...'
  ];

  useEffect(() => {
    if (!analyzing) {
      setCurrentStep(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [analyzing]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const finalTitle = getEffectiveJobTitle();
    const finalCompany = getEffectiveCompanyName();
    const finalDesc = getEffectiveJobDescription();

    // Ensure state is synchronized before triggering analysis callback
    if (finalTitle !== jobTitle) setJobTitle(finalTitle);
    if (finalCompany !== companyName) setCompanyName(finalCompany);
    if (finalDesc !== jobDescription) setJobDescription(finalDesc);

    const validSubmission = Boolean(isResumeValid && finalTitle.length >= 2 && finalDesc.length >= 10);

    if (validSubmission && !analyzing) {
      let fileToPass = resumeFile || activeResumeFile;
      if (!fileToPass && activeResumeAnalysis) {
        const fn = activeResumeAnalysis.filename || activeResumeAnalysis.originalName || 'Resume_Document.pdf';
        const fileText = activeResumeAnalysis.rawText || activeResumeAnalysis.executiveSummary || 'Parsed resume text';
        const blob = new Blob([fileText], { type: 'application/pdf' });
        fileToPass = new File([blob], fn, { type: 'application/pdf' });
      }

      onAnalyzeMatch({
        resumeFile: fileToPass,
        jobTitle: finalTitle || activeResumeAnalysis?.candidateLevel || 'Target Position',
        companyName: finalCompany,
        jobDescription: finalDesc
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
      
      {/* Standardized Page Header */}
      <PageHeader
        title="Job Matcher"
        subtitle="Compare your resume against any job description."
        backTo="/app/dashboard"
        backLabel="Back to Dashboard"
      />

      {/* Linear Dashboard Form matching Skill Gap & Roadmap */}
      <form onSubmit={handleFormSubmit} className="space-y-6" aria-label="Job Matcher Form">
          
          {/* SECTION 1: Candidate Resume Selection */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 pb-3 border-b border-[#30363D]">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">1. Candidate Resume PDF</h3>
                <p className="text-xs text-gray-400">Selected workspace resume for target job comparison</p>
              </div>
            </div>

            {/* Active Workspace Resume Selected Card */}
            {activeResumeAnalysis && !isChangingResume ? (
              <div className="bg-[#0D1117] border border-blue-500/30 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">
                        {activeResumeAnalysis.filename || 'Active_Resume.pdf'}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        {activeResumeAnalysis.atsScore || activeResumeAnalysis.resumeScore || 85} ATS Score
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-600/10 border border-blue-500/30 text-blue-400">
                        Active Workspace Resume
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Role: <strong className="text-gray-300 font-semibold">{activeResumeAnalysis.candidateLevel || 'Software Engineer'}</strong> • Analyzed {activeResumeAnalysis.formattedDate || 'Recently'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsChangingResume(true)}
                  className="px-3 py-1.5 bg-[#161B22] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] text-xs font-semibold rounded-xl transition-colors cursor-pointer self-end sm:self-auto flex-shrink-0"
                >
                  Change Resume
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <ResumeUploader 
                  initialFile={initialResumeFile || activeResumeFile}
                  onUploadComplete={(file) => {
                    setResumeFile(file);
                    setResumeTouched(true);
                    setIsChangingResume(false);
                  }} 
                />
                {activeResumeAnalysis && (
                  <button
                    type="button"
                    onClick={() => setIsChangingResume(false)}
                    className="text-xs text-blue-400 hover:underline font-semibold block"
                  >
                    ← Use active workspace resume ({activeResumeAnalysis.filename})
                  </button>
                )}
              </div>
            )}

            {showResumeError && (
              <div className="flex items-center gap-2 text-rose-400 text-xs font-medium pt-1 animate-fadeIn" role="alert">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Please select or upload a PDF resume.</span>
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
                  name="jobTitle"
                  type="text"
                  autoComplete="on"
                  value={jobTitle}
                  onChange={handleJobTitleInputChange}
                  onInput={handleJobTitleInputChange}
                  onBlur={(e) => {
                    handleJobTitleInputChange(e);
                    setJobTitleTouched(true);
                  }}
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
                  name="companyName"
                  type="text"
                  autoComplete="on"
                  value={companyName}
                  onChange={handleCompanyNameInputChange}
                  onInput={handleCompanyNameInputChange}
                  onBlur={handleCompanyNameInputChange}
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
                name="jobDescription"
                rows={7}
                value={jobDescription}
                onChange={handleJobDescInputChange}
                onInput={handleJobDescInputChange}
                onBlur={(e) => {
                  handleJobDescInputChange(e);
                  setJobDescTouched(true);
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

    </div>
  );
};
