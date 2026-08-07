import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Lightbulb, 
  ArrowLeft, 
  RefreshCw, 
  Sparkles, 
  FileText, 
  TrendingUp, 
  ShieldCheck,
  Info,
  Copy,
  Check,
  Download,
  Zap,
  User,
  ArrowRight
} from 'lucide-react';
import { Toast } from '../../components/Toast';

export const ResumeAnalysisResult = ({ analysisData, resumeFile, onReset }) => {
  const navigate = useNavigate();
  const { profile, updateProfile, resumeHistory, activeResumeFile, setSharedResumeFile } = useWorkspace();

  const activeFile = (resumeFile && (resumeFile instanceof File || resumeFile instanceof Blob))
    ? resumeFile
    : (activeResumeFile && (activeResumeFile instanceof File || activeResumeFile instanceof Blob))
      ? activeResumeFile
      : (analysisData?.file && (analysisData.file instanceof File || analysisData.file instanceof Blob))
        ? analysisData.file
        : null;

  console.log("STEP 5 - ResumeAnalysisResult received:", activeFile);
  const [toastMsg, setToastMsg] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayAtsScore, setDisplayAtsScore] = useState(0);

  const {
    score = 92,
    atsScore = 94,
    candidateLevel = "Software Engineering Candidate",
    interviewPotential = "High Interview Callback Potential",
    atsAssessment = "Fully ATS Machine-Readable Layout",
    executiveSummary = "Your resume demonstrates strong technical depth, clear project achievements, and standard ATS formatting.",
    strengths = [],
    weaknesses = [],
    missingSkills = [],
    recommendations = [],
    fromHistory = false,
    meta = {}
  } = analysisData || {};

  const extractedName = analysisData?.candidateName || analysisData?.extractedName || analysisData?.personalInfo?.name || null;

  // Determine if this is the first resume analyzed in the CURRENT workspace.
  const isFirstResumeInWorkspace = (resumeHistory || []).length <= 1;

  useEffect(() => {
    if (!extractedName) return;

    if (isFirstResumeInWorkspace) {
      // First resume in current workspace: silently populate workspace profile if uninitialized or blank
      if (!profile?.name || !profile?.completedOnboarding) {
        updateProfile({ name: extractedName });
      }
    }
  }, [extractedName, isFirstResumeInWorkspace]);

  const [showNameBanner, setShowNameBanner] = useState(() => {
    // Condition 1: Never show banner on the first resume analyzed in a workspace
    if (isFirstResumeInWorkspace) return false;

    // Condition 2: Must have a valid extracted name and an existing workspace profile name
    if (!extractedName || !profile?.name) return false;

    // Condition 3: Show banner ONLY if extracted name differs from current workspace profile
    return extractedName.trim().toLowerCase() !== profile.name.trim().toLowerCase();
  });

  // Animated Score Counters
  useEffect(() => {
    let startScore = 0;
    let startAts = 0;
    const duration = 1000;
    const incrementTime = 20;
    const stepCount = duration / incrementTime;
    const incScore = score / stepCount;
    const incAts = atsScore / stepCount;

    const timer = setInterval(() => {
      startScore += incScore;
      startAts += incAts;

      if (startScore >= score) {
        setDisplayScore(score);
      } else {
        setDisplayScore(Math.floor(startScore));
      }

      if (startAts >= atsScore) {
        setDisplayAtsScore(atsScore);
      } else {
        setDisplayAtsScore(Math.floor(startAts));
      }

      if (startScore >= score && startAts >= atsScore) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [score, atsScore]);

  const handleCopySection = (text, sectionName) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSection(sectionName);
      setToastMsg(`Copied ${sectionName} to clipboard!`);
      setTimeout(() => setCopiedSection(null), 2500);
    }
  };

  const handleDownloadMarkdownReport = () => {
    const mdContent = `# AI Resume Analysis Report
    
**Overall Score**: ${score}/100
**ATS Compatibility**: ${atsScore}/100
**Candidate Level**: ${candidateLevel}

## Executive Summary
${executiveSummary}

## Key Strengths
${strengths.map(s => `- ${typeof s === 'string' ? s : s.title}`).join('\n')}

## Critical Missing Skills
${missingSkills.map(m => `- ${typeof m === 'string' ? m : m.name}`).join('\n')}

## Recommended Improvements
${recommendations.map(r => `- ${typeof r === 'string' ? r : r.title}`).join('\n')}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resume_Analysis_Report_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToastMsg("Report downloaded successfully!");
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Name Difference Update Banner */}
      {showNameBanner && extractedName && (
        <div className="bg-[#161B22] border border-blue-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">
              <User className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm text-gray-200">
              We found <strong className="text-white font-semibold">"{extractedName}"</strong> in your resume. Would you like to update your workspace profile?
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            <button
              onClick={() => {
                updateProfile({ name: extractedName });
                setShowNameBanner(false);
              }}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Update Profile
            </button>

            <button
              onClick={() => setShowNameBanner(false)}
              className="px-3.5 py-1.5 bg-[#0D1117] hover:bg-[#21262d] text-gray-400 hover:text-white border border-[#30363D] text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Keep Current
            </button>
          </div>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#30363D]">
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-[#161B22] hover:bg-[#21262d] text-gray-300 border border-[#30363D] transition-colors cursor-pointer"
            title="Back to uploader"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Resume ATS Evaluation Report</span>
              {fromHistory && (
                <span className="text-xs font-normal text-blue-400 bg-blue-600/10 border border-blue-500/30 px-2 py-0.5 rounded font-mono">
                  From Saved Workspace History
                </span>
              )}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {meta.originalName ? `File: ${meta.originalName}` : 'Scanned Resume Document'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleDownloadMarkdownReport}
            className="px-3.5 py-2 bg-[#161B22] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" /> Download Report
          </button>

          <button
            onClick={onReset}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Scan Another Resume
          </button>
        </div>
      </div>

      {/* Main Score Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Score 1: Overall ATS Score */}
        <div className="bg-[#161B22] rounded-xl p-6 border border-[#30363D] flex flex-col justify-between space-y-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Overall Resume Score
              </span>
              <h2 className="text-4xl font-extrabold text-white mt-1">
                {displayScore}<span className="text-base text-gray-400 font-normal">/100</span>
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-600/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> {interviewPotential}
            </span>
            <div className="w-full bg-[#0D1117] h-2 rounded-full overflow-hidden border border-[#30363D]">
              <div className="bg-green-500 h-full rounded-full transition-all duration-300" style={{ width: `${displayScore}%` }} />
            </div>
          </div>
        </div>

        {/* Score 2: ATS Scanner Machine Readability */}
        <div className="bg-[#161B22] rounded-xl p-6 border border-[#30363D] flex flex-col justify-between space-y-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                ATS Compatibility Rate
              </span>
              <h2 className="text-4xl font-extrabold text-white mt-1">
                {displayAtsScore}<span className="text-base text-gray-400 font-normal">%</span>
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {atsAssessment}
            </span>
            <div className="w-full bg-[#0D1117] h-2 rounded-full overflow-hidden border border-[#30363D]">
              <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${displayAtsScore}%` }} />
            </div>
          </div>
        </div>

        {/* Candidate Detected Level */}
        <div className="bg-[#161B22] rounded-xl p-6 border border-[#30363D] flex flex-col justify-between space-y-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Assessed Level
              </span>
              <h2 className="text-lg font-bold text-white mt-2 leading-snug">
                {candidateLevel}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Derived from detected skills, project complexity, and technical keyword density.
          </p>
        </div>

      </div>

      {/* Executive AI Summary */}
      <div className="bg-[#161B22] rounded-xl p-6 border border-[#30363D] space-y-3 shadow-sm">
        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" /> Executive AI Analysis Summary
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed font-sans">
          {executiveSummary}
        </p>
      </div>

      {/* Strengths & Weaknesses 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Key Strengths */}
        <div className="bg-[#161B22] rounded-xl p-6 border border-[#30363D] space-y-4">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Identified Key Strengths
            </h3>
            <span className="text-xs text-green-400 font-mono font-bold">{strengths.length} Found</span>
          </div>

          <div className="space-y-3">
            {strengths.map((item, idx) => {
              const title = typeof item === 'string' ? item : item.title;
              const detail = typeof item === 'string' ? '' : item.description;
              return (
                <div key={idx} className="p-3.5 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-1">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {title}
                  </h4>
                  {detail && <p className="text-xs text-gray-400 pl-3 leading-relaxed">{detail}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Missing Skills & Keywords */}
        <div className="bg-[#161B22] rounded-xl p-6 border border-[#30363D] space-y-4">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Missing High-Impact Keywords
            </h3>
            <span className="text-xs text-amber-400 font-mono font-bold">{missingSkills.length} Identified</span>
          </div>

          <div className="space-y-3">
            {missingSkills.map((item, idx) => {
              const name = typeof item === 'string' ? item : item.name;
              const reason = typeof item === 'string' ? '' : item.reason;
              return (
                <div key={idx} className="p-3.5 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {name}
                    </h4>
                    <button
                      onClick={() => handleCopySection(name, `Keyword "${name}"`)}
                      className="text-[11px] text-gray-400 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSection === `Keyword "${name}"` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  {reason && <p className="text-xs text-gray-400 pl-3 leading-relaxed">{reason}</p>}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Actionable Recommendations List */}
      <div className="bg-[#161B22] rounded-xl p-6 border border-[#30363D] space-y-4 shadow-sm">
        <div className="border-b border-[#30363D] pb-3">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-500" /> Actionable Recommendations to Maximize ATS Score
          </h3>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec, idx) => {
            const title = typeof rec === 'string' ? rec : rec.title;
            const desc = typeof rec === 'string' ? '' : rec.description;
            return (
              <div key={idx} className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-blue-600/20 text-blue-400 text-[10px] font-mono flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    {title}
                  </h4>
                  <button
                    onClick={() => handleCopySection(`${title}\n${desc}`, `Recommendation #${idx + 1}`)}
                    className="text-xs text-gray-400 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSection === `Recommendation #${idx + 1}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                {desc && <p className="text-xs text-gray-400 pl-7 leading-relaxed">{desc}</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Next Step Success Card */}
      <div className="bg-[#161B22] border-2 border-green-500/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
              ✅ Stage 1 Complete
            </span>
            <h3 className="text-lg font-extrabold text-white mt-1">Resume Analysis Complete</h3>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Your resume has been successfully analyzed with an ATS Score of <strong className="text-green-400 font-mono font-bold">{score}/100</strong>. The next recommended step is to compare your resume against your target job description to uncover missing skills and custom keywords.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => {
              let fileToPass = activeFile;

              if (!fileToPass || !(fileToPass instanceof File)) {
                const fileName = analysisData?.filename || analysisData?.meta?.originalName || 'Analyzed_Resume.pdf';
                const fileText = analysisData?.executiveSummary || analysisData?.candidateName || 'Parsed candidate resume details.';
                const blob = new Blob([fileText], { type: 'application/pdf' });
                fileToPass = new File([blob], fileName, { type: 'application/pdf' });
              }

              console.log("STEP 6 - Before navigation:", fileToPass);

              setSharedResumeFile(fileToPass);

              navigate('/app/job-matcher', {
                state: {
                  fromResumeAnalyzer: true
                }
              });
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Continue to Job Matcher</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#0D1117] hover:bg-[#21262d] text-gray-400 hover:text-white border border-[#30363D] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Stay Here
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
      )}

    </div>
  );
};
