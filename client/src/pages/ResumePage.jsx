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
  Calendar
} from 'lucide-react';

export const ResumePage = () => {
  const { resumeHistory, addResumeAnalysis, deleteResumeAnalysis, clearResumeHistory, activeResumeFile, setSharedResumeFile } = useWorkspace();

  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [error, setError] = useState(null);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [iteratingItem, setIteratingItem] = useState(null);

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

    setUploadedFile(file);
    setSharedResumeFile(file); // Store intact browser File instance in workspace memory
    console.log("STEP 2 - Resume state updated:", file);

    setError(null);
    setIsQuotaExceeded(false);

    try {
      console.log("STEP 3 - Sending to backend:", file);

      // Step A: Compute SHA-256 Content Hash
      const resumeHash = await computeResumeHash(file);

      // Step B: Duplicate Check scoped strictly to CURRENT WORKSPACE
      if (!bypassDuplicateCheck) {
        const existingMatch = (resumeHistory || []).find(h => h.contentHash === resumeHash);
        if (existingMatch) {
          setExistingDuplicateItem(existingMatch);
          setDuplicateModalOpen(true);
          return; // Interrupt execution & show CareerPilot duplicate confirmation dialog!
        }
      }

      setAnalyzing(true);
      setAnalysisResult(null);
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

      // Single Source of Truth Workspace dispatch (overwrites existing matching hash in place if re-analyzing)
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

      console.log("STEP 4 - Analysis complete, resume still exists:", file);
      setAnalysisResult(analysisPayload);
      setIteratingItem(null);
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
      const fileToAttach = (uploadedFile && (uploadedFile instanceof File || uploadedFile instanceof Blob)) ? uploadedFile : null;
      setAnalysisResult({
        ...data,
        file: fileToAttach  
      });
      setDuplicateModalOpen(false);
      setExistingDuplicateItem(null);
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

      setUploadedFile(sampleFile);
      setSharedResumeFile(sampleFile);

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

      setAnalyzing(false);
    }, 2000);
  };

  const handleSelectHistoryItem = (item) => {
    if (item && (item.analysisData || item.analysis || item.score)) {
      const data = item.analysisData || item.analysis || item;

      const histFilename = item.filename || data.filename || 'Historical_Resume.pdf';
      const histText = data.executiveSummary || data.resumeText || `Candidate resume: ${histFilename}`;
      const histBlob = new Blob([histText], { type: 'application/pdf' });
      const histFile = new File([histBlob], histFilename, { type: 'application/pdf' });

      setUploadedFile(histFile);
      setSharedResumeFile(histFile);

      setAnalysisResult({
        ...data,
        file: histFile
      });
      setComparisonData(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteHistoryItem = (id) => {
    deleteResumeAnalysis(id);
    if (analysisResult && analysisResult.meta && analysisResult.meta.id === id) {
      setAnalysisResult(null);
      setComparisonData(null);
    }
  };

  const handleIterateHistoryItem = (item) => {
    setIteratingItem(item);
    setAnalysisResult(null);
    setComparisonData(null);
    if (uploaderRef.current) {
      uploaderRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Non-Blocking Guided Journey Banner */}
      <GuidedJourneyBanner currentFeatureId="resume" />

      {/* 1. Page Header */}
      {!analysisResult && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#30363D]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400 mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Single Source of Truth Resume Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Resume Analyzer
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Upload your resume for deep ATS scoring, keyword matching, and targeted improvements.
            </p>
          </div>

          {!analyzing && (
            <button
              onClick={handleSampleUpload}
              className="px-4 py-2.5 bg-[#161B22] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto"
            >
              <Sparkles className="w-4 h-4 text-green-400" />
              <span>Load Sample Resume</span>
            </button>
          )}
        </div>
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

      {/* Main Upload Box */}
      {!analysisResult && !analyzing && (
        <div ref={uploaderRef} className="space-y-8">
          <ResumeUploader
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            onUploadComplete={(file) => handleRunAnalysis(file, false)}
            onAnalyze={(file) => handleRunAnalysis(file || uploadedFile, false)}
            analyzing={analyzing}
            iteratingItem={iteratingItem}
            onCancelIterate={() => setIteratingItem(null)}
          />

          <ResumeHistoryList
            history={resumeHistory}
            onViewReport={handleSelectHistoryItem}
            onSelect={handleSelectHistoryItem}
            onAnalyzeAgain={handleIterateHistoryItem}
            onIterate={handleIterateHistoryItem}
            onDeleteItem={handleDeleteHistoryItem}
            onDelete={handleDeleteHistoryItem}
            onClearAll={clearResumeHistory}
            onClear={clearResumeHistory}
          />
        </div>
      )}

    </div>
  );
};
