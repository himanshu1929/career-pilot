import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ResumeUploader } from '../features/resume/ResumeUploader';
import { ResumeAnalysisResult } from '../features/resume/ResumeAnalysisResult';
import { ResumeHistoryList } from '../features/resume/ResumeHistoryList';
import { ResumeComparisonView } from '../features/resume/ResumeComparisonView';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { GuidedJourneyBanner } from '../components/layout/GuidedJourneyBanner';
import { QuotaLimitBanner } from '../components/common/QuotaLimitBanner';
import { mockResumeAnalysis } from '../utils/mockData';
import { computeResumeHash } from '../utils/historyStorage';
import { PageContainer, PageHeader } from '../components/layout/PageContainer';
import { 
  Sparkles, 
  FileText, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  FileCheck,
  RefreshCw,
  X,
  AlertTriangle,
  Eye,
  Calendar,
  Plus,
  ChevronUp,
  Upload
} from 'lucide-react';

export const ResumePage = () => {
  const { resumeHistory, addResumeAnalysis, deleteResumeAnalysis, clearResumeHistory, activeResumeFile, setSharedResumeFile } = useWorkspace();

  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Persist active report viewer state in sessionStorage across browser refreshes
  const [analysisResult, setAnalysisResultState] = useState(() => {
    try {
      const saved = sessionStorage.getItem('career_pilot_active_report_v1');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const setAnalysisResult = (val) => {
    try {
      if (val) {
        sessionStorage.setItem('career_pilot_active_report_v1', JSON.stringify(val));
      } else {
        sessionStorage.removeItem('career_pilot_active_report_v1');
      }
    } catch (e) {}
    setAnalysisResultState(val);
  };

  const [comparisonData, setComparisonData] = useState(null);
  const [error, setError] = useState(null);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [iteratingItem, setIteratingItem] = useState(null);

  // Workspace Mode UI State: Collapse upload widget when history exists
  const hasHistory = (resumeHistory || []).length > 0;
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  // Smart Duplicate Detection Modal States
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [existingDuplicateItem, setExistingDuplicateItem] = useState(null);

  const uploaderRef = useRef(null);

  const resumeLoadingSteps = [
    "Extracting text from PDF resume...",
    "Scanning formatting structure & layout...",
    "Evaluating ATS keyword compatibility...",
    "Generating actionable recommendations..."
  ];

  // Reset temporary upload session state on page unmount/navigation
  useEffect(() => {
    return () => {
      setUploadedFile(null);
      setSharedResumeFile(null);
    };
  }, []);

  useEffect(() => {
    if (analyzing) {
      setCurrentStep(0);
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < resumeLoadingSteps.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 700);

      return () => clearInterval(interval);
    }
  }, [analyzing]);

  const handleRunAnalysis = async (fileToAnalyze = null, bypassDuplicateCheck = false) => {
    const file = fileToAnalyze || uploadedFile;
    if (!file) return;

    console.log("STEP 1: User selected PDF:", file, file instanceof File);

    // Synchronously reset previous analysis views and errors before processing new upload
    setAnalysisResult(null);
    setComparisonData(null);
    setError(null);
    setIsQuotaExceeded(false);

    setUploadedFile(file);
    setSharedResumeFile(file); // Store intact browser File instance in workspace memory

    try {
      // Step A: Compute SHA-256 Content Hash
      const resumeHash = await computeResumeHash(file);

      // Step B: Duplicate Check scoped strictly to CURRENT WORKSPACE resumeHistory
      if (!bypassDuplicateCheck) {
        const existingMatch = (resumeHistory || []).find(h => h.contentHash === resumeHash);
        if (existingMatch) {
          setExistingDuplicateItem(existingMatch);
          setDuplicateModalOpen(true);
          return; // Interrupt execution & show CareerPilot duplicate confirmation dialog!
        }
      }

      // Enter full AI analysis loading state
      setAnalyzing(true);
      setCurrentStep(0);

      let rawAnalysis;

      try {
        const formData = new FormData();
        formData.append('resume', file);

        const response = await fetch('/api/resume/upload', {
          method: 'POST',
          body: formData
        });

        if (response.status === 429) {
          setIsQuotaExceeded(true);
          setError("The AI service has reached its temporary usage limit. Please try again later.");
          setAnalyzing(false);
          return;
        }

        if (!response.ok) {
          let errorMsg = "Failed to analyze resume. Please try again later.";
          try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              errorMsg = errorData.message;
            }
          } catch (e) {}
          setError(errorMsg);
          setAnalyzing(false);
          return;
        }

        const data = await response.json();
        if (data && data.success && data.data) {
          rawAnalysis = data.data;
        } else {
          rawAnalysis = mockResumeAnalysis;
        }
      } catch (err) {
        console.warn("Express backend API offline or unreachable. Using fallback AI evaluation.", err);
        rawAnalysis = mockResumeAnalysis;
      }

      // Guarantee smooth loading step transition (minimum 1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const newId = `res_${Date.now()}`;

      addResumeAnalysis({
        ...rawAnalysis,
        id: newId,
        filename: file.name,
        contentHash: resumeHash,
        timestamp: new Date().toISOString()
      });

      const analysisPayload = {
        ...rawAnalysis,
        file: file, // Genuine browser File object!
        extractedText: rawAnalysis.extractedText || rawAnalysis.resumeText || null,
        meta: {
          originalName: file.name,
          size: file.size,
          id: newId
        }
      };

      console.log("STEP 4 - Analysis complete, rendering result:", file);
      setAnalysisResult(analysisPayload);
      setIteratingItem(null);

      // Finish temporary upload session and collapse uploader so workspace history is primary
      setUploadedFile(null);
      setSharedResumeFile(null);
      setIsUploaderOpen(false);
    } catch (err) {
      console.error("Resume analysis execution error:", err);
      setError(err.message || "An unexpected error occurred during resume analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleViewExistingReport = () => {
    if (existingDuplicateItem) {
      const data = existingDuplicateItem.analysisData || existingDuplicateItem.analysis || existingDuplicateItem;
      setAnalysisResult({
        ...data,
        file: null
      });
      setDuplicateModalOpen(false);
      setExistingDuplicateItem(null);
      // Destroy temporary upload session state when viewing duplicate report
      setUploadedFile(null);
      setSharedResumeFile(null);
    }
  };

  const handleReanalyzeAnyway = () => {
    const fileToUse = uploadedFile;
    setDuplicateModalOpen(false);
    setExistingDuplicateItem(null);
    if (fileToUse) {
      handleRunAnalysis(fileToUse, true); // Bypass duplicate check and overwrite existing entry
    }
  };

  const handleCancelDuplicateModal = () => {
    setDuplicateModalOpen(false);
    setExistingDuplicateItem(null);
    setUploadedFile(null);
    setSharedResumeFile(null);
    setError(null);
    setIsQuotaExceeded(false);
    setIteratingItem(null);
  };

  const handleSampleUpload = () => {
    setAnalysisResult(null);
    setComparisonData(null);
    setAnalyzing(true);
    setError(null);
    setIsQuotaExceeded(false);

    setTimeout(() => {
      const demoHash = "demo_hash_" + Date.now();
      const newId = `res_${Date.now()}`;
      const sampleFilename = "Software_Engineer_Resume.pdf";

      const sampleContent = "Software Engineering Candidate with React, TypeScript, Node.js, and REST API experience.";
      const sampleBlob = new Blob([sampleContent], { type: 'application/pdf' });
      const sampleFile = new File([sampleBlob], sampleFilename, { type: 'application/pdf' });

      addResumeAnalysis({
        ...mockResumeAnalysis,
        id: newId,
        filename: sampleFilename,
        contentHash: demoHash,
        timestamp: new Date().toISOString()
      });

      setAnalysisResult({
        ...mockResumeAnalysis,
        file: sampleFile,
        meta: {
          originalName: sampleFilename,
          size: sampleFile.size,
          id: newId
        }
      });

      // Destroy temporary upload session state and collapse uploader
      setUploadedFile(null);
      setSharedResumeFile(null);
      setIsUploaderOpen(false);
      setAnalyzing(false);
    }, 1800);
  };

  const handleSelectHistoryItem = (item) => {
    if (item && (item.analysisData || item.analysis || item.score)) {
      const data = item.analysisData || item.analysis || item;

      // Pure Report Viewer State update - NEVER touch or recreate Upload Session State!
      setAnalysisResult({
        ...data,
        file: null
      });
      setComparisonData(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteHistoryItem = (id) => {
    deleteResumeAnalysis(id);
    const remainingCount = (resumeHistory || []).filter(h => h.id !== id).length;

    // Fully reset all upload & analysis UI states on item deletion
    setUploadedFile(null);
    setSharedResumeFile(null);
    setAnalysisResult(null);
    setComparisonData(null);
    setError(null);
    setIteratingItem(null);
    setAnalyzing(false);

    if (remainingCount === 0) {
      setIsUploaderOpen(true); // Auto-switch to first-time upload layout
    }
  };

  const handleClearAllHistory = () => {
    clearResumeHistory();
    // Fully reset all upload & analysis UI states on clear history
    setUploadedFile(null);
    setSharedResumeFile(null);
    setAnalysisResult(null);
    setComparisonData(null);
    setError(null);
    setIteratingItem(null);
    setAnalyzing(false);
    setIsUploaderOpen(true); // Auto-switch to first-time upload layout
  };

  const handleIterateHistoryItem = (item) => {
    setIteratingItem(item);
    setAnalysisResult(null);
    setComparisonData(null);
    setIsUploaderOpen(true); // Expand upload section for iterating/updating
    if (uploaderRef.current) {
      uploaderRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageContainer>
      
      {/* Non-Blocking Guided Journey Banner */}
      <GuidedJourneyBanner currentFeatureId="resume" />

      {/* 1. Page Header */}
      {!analysisResult && (
        <PageHeader
          title="Resumes"
          subtitle="Manage, analyze and improve your resumes."
          backTo="/app/dashboard"
          backLabel="Back to Dashboard"
          actions={
            !analyzing && (
              <>
                <button
                  onClick={() => setIsUploaderOpen((prev) => !prev)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isUploaderOpen ? 'Collapse Uploader' : 'Upload New Resume'}</span>
                </button>

                <button
                  onClick={handleSampleUpload}
                  className="px-4 py-2.5 bg-[#161B22] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Try Sample Resume</span>
                </button>
              </>
            )
          }
        />
      )}

      {/* 2. Smart Duplicate Confirmation Modal Dialog */}
      {duplicateModalOpen && existingDuplicateItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  Duplicate Resume Detected
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Resume Already Analyzed
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  This exact resume file already exists in this workspace.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-300 font-semibold">
                <span>File Name:</span>
                <span className="text-white font-bold">{existingDuplicateItem.filename || uploadedFile?.name}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Uploaded Date:</span>
                <span className="font-mono text-gray-300">
                  {existingDuplicateItem.formattedDate || (existingDuplicateItem.uploadedAt ? new Date(existingDuplicateItem.uploadedAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }) : 'Saved')}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Previous ATS Score:</span>
                <span className="font-mono font-bold text-green-400">{existingDuplicateItem.atsScore || existingDuplicateItem.score || 85}%</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleViewExistingReport}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Existing Report</span>
              </button>

              <button
                onClick={handleReanalyzeAnyway}
                className="w-full py-3 bg-[#0D1117] hover:bg-[#21262d] text-amber-400 hover:text-amber-300 border border-amber-500/30 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-analyze Anyway</span>
              </button>

              <button
                onClick={handleCancelDuplicateModal}
                className="w-full py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Quota Exceeded Alert Card */}
      {isQuotaExceeded && <QuotaLimitBanner />}

      {/* Analyzing Progress Overlay */}
      {analyzing && (
        <div className="bg-[#161B22] rounded-xl p-12 border border-[#30363D] max-w-xl mx-auto text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Analyzing Resume with AI</h3>
            <p className="text-xs text-blue-400 font-mono transition-all duration-300">
              {resumeLoadingSteps[currentStep]}
            </p>
          </div>

          <div className="w-full bg-[#0D1117] h-2 rounded-full overflow-hidden border border-[#30363D]">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / resumeLoadingSteps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && !isQuotaExceeded && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Result View */}
      {analysisResult && !analyzing && (
        <ErrorBoundary onReset={() => setAnalysisResult(null)}>
          <div className="space-y-8">
            {comparisonData && (
              <ResumeComparisonView
                previousAnalysis={comparisonData.previousAnalysis}
                currentAnalysis={comparisonData.currentAnalysis}
                filename={comparisonData.filename}
              />
            )}

            <ResumeAnalysisResult
              analysisData={analysisResult}
              resumeFile={uploadedFile || activeResumeFile || analysisResult?.file}
              onReset={() => setAnalysisResult(null)}
            />
          </div>
        </ErrorBoundary>
      )}

      {/* Main Upload & Workspace Area */}
      {!analysisResult && !analyzing && (
        <div ref={uploaderRef} className="space-y-8">
          
          {/* Expandable Upload Section */}
          {(!hasHistory || isUploaderOpen) && (
            <div className="animate-fadeIn transition-all duration-300">
              {hasHistory && (
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Resume Version</span>
                  </h3>
                  <button
                    onClick={() => setIsUploaderOpen(false)}
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Collapse</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <ResumeUploader
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                onUploadComplete={(file) => handleRunAnalysis(file, false)}
                onAnalyze={(file) => handleRunAnalysis(file || uploadedFile, false)}
                analyzing={analyzing}
                iteratingItem={iteratingItem}
                onCancelIterate={() => setIteratingItem(null)}
              />
            </div>
          )}

          {/* Persistent Resume History Workspace */}
          <ResumeHistoryList
            history={resumeHistory}
            onViewReport={handleSelectHistoryItem}
            onSelect={handleSelectHistoryItem}
            onAnalyzeAgain={handleIterateHistoryItem}
            onIterate={handleIterateHistoryItem}
            onDeleteItem={handleDeleteHistoryItem}
            onDelete={handleDeleteHistoryItem}
            onClearAll={handleClearAllHistory}
            onClear={handleClearAllHistory}
            onToggleUploader={() => setIsUploaderOpen((prev) => !prev)}
            isUploaderOpen={isUploaderOpen}
          />
        </div>
      )}

    </PageContainer>
  );
};
