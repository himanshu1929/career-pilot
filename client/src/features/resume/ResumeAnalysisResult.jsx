import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { 
  Award, 
  ShieldCheck, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Search, 
  Zap, 
  Download, 
  RefreshCw, 
  User 
} from 'lucide-react';

export const ResumeAnalysisResult = ({ analysisData, resumeFile, onReset }) => {
  const navigate = useNavigate();
  const { profile, updateProfile, resumeHistory, activeResumeFile, setSharedResumeFile, setActiveResumeId } = useWorkspace();

  const activeFile = (resumeFile && (resumeFile instanceof File || resumeFile instanceof Blob))
    ? resumeFile
    : (activeResumeFile && (activeResumeFile instanceof File || activeResumeFile instanceof Blob))
      ? activeResumeFile
      : (analysisData?.file && (analysisData.file instanceof File || analysisData.file instanceof Blob))
        ? analysisData.file
        : null;

  const [displayScore, setDisplayScore] = useState(0);
  const [displayAtsScore, setDisplayAtsScore] = useState(0);

  const {
    score = 92,
    atsScore = 94,
    candidateLevel = "Software Engineer",
    interviewPotential = "High Interview Potential",
    atsAssessment = "Fully ATS Compatible",
    executiveSummary = "Your resume demonstrates strong technical depth, clear project achievements, and standard ATS formatting.",
    strengths = [],
    weaknesses = [],
    missingSkills = [],
    recommendations = [],
    meta = {}
  } = analysisData || {};

  const extractedName = analysisData?.candidateName || analysisData?.extractedName || analysisData?.personalInfo?.name || null;
  const fileName = meta?.originalName || analysisData?.filename || 'Resume_Document.pdf';
  const formattedDate = meta?.formattedDate || (analysisData?.timestamp ? new Date(analysisData.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today');

  // Name sync profile check
  const isFirstResumeInWorkspace = (resumeHistory || []).length <= 1;

  useEffect(() => {
    if (!extractedName) return;
    if (isFirstResumeInWorkspace && (!profile?.name || !profile?.completedOnboarding)) {
      updateProfile({ name: extractedName });
    }
  }, [extractedName, isFirstResumeInWorkspace]);

  const [showNameBanner, setShowNameBanner] = useState(() => {
    if (isFirstResumeInWorkspace) return false;
    if (!extractedName || !profile?.name) return false;
    return extractedName.trim().toLowerCase() !== profile.name.trim().toLowerCase();
  });

  // Animated Count-Up Score Counters
  useEffect(() => {
    let startScore = 0;
    let startAts = 0;
    const duration = 600;
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

  // Target score improvement range
  const targetScoreRange = useMemo(() => {
    if (score >= 90) return "92–98";
    const minTarget = Math.min(92, score + 15);
    const maxTarget = Math.min(98, minTarget + 5);
    return `${minTarget}–${maxTarget}`;
  }, [score]);

  // Concise AI Verdict paragraph (max 2 lines)
  const aiVerdictParagraph = useMemo(() => {
    if (score >= 85) {
      return "Your resume has an exceptional technical foundation and strong ATS alignment. The main opportunity is tailoring keywords for specialized target roles.";
    }
    if (score >= 70) {
      return "Your resume has a solid technical foundation. The biggest opportunity is adding measurable project metrics and missing domain keywords.";
    }
    return "Your resume has a solid technical foundation. The biggest opportunity is stronger project impact and ATS keyword optimization.";
  }, [score]);

  // Primary and secondary match titles for Target Role column
  const primaryRoleMatch = useMemo(() => {
    if (!candidateLevel) return "Software Engineer";
    const parts = candidateLevel.split('/');
    return parts[0].trim();
  }, [candidateLevel]);

  const secondaryRoleMatch = useMemo(() => {
    if (!candidateLevel || !candidateLevel.includes('/')) return "Junior Software Engineer";
    const parts = candidateLevel.split('/');
    return parts[1].trim();
  }, [candidateLevel]);

  // Concise 1-line bullet lists for AI Summary (max 5 bullets each)
  const strengthsBullets = useMemo(() => {
    if (strengths && strengths.length > 0) {
      return strengths.slice(0, 5).map(s => typeof s === 'string' ? s : s.title);
    }
    return [
      "Solid foundational programming & framework skills",
      "Clean formatting compatible with standard ATS parsers",
      "Clear educational background and project portfolio"
    ];
  }, [strengths]);

  const needsBullets = useMemo(() => {
    if (weaknesses && weaknesses.length > 0) {
      return weaknesses.slice(0, 5).map(w => typeof w === 'string' ? w : w.title);
    }
    return [
      "Missing quantifiable metrics for key project accomplishments",
      "Lacks several high-impact domain keywords",
      "Project descriptions need direct deployment links"
    ];
  }, [weaknesses]);

  const handleDownloadMarkdownReport = () => {
    const mdContent = `# Resume Analysis Report - ${fileName}
    
**Overall Score**: ${score}/100
**ATS Compatibility**: ${atsScore}/100
**Assessed Role**: ${candidateLevel}
**Analyzed Date**: ${formattedDate}

## AI Verdict
${aiVerdictParagraph}
Target Potential Score: ${targetScoreRange} ATS

## Executive Summary
${executiveSummary}

## Key Strengths
${strengthsBullets.map(s => `- ${s}`).join('\n')}

## Critical Missing Keywords
${missingSkills.map(m => `- ${typeof m === 'string' ? m : m.name}`).join('\n')}

## Recommended Improvements
${recommendations.map((r, i) => `${i + 1}. ${typeof r === 'string' ? r : r.title}`).join('\n')}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resume_Analysis_${fileName.replace(/\.pdf$/i, '')}_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const scrollToRecommendations = () => {
    const el = document.getElementById('recommendations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContinueToJobMatcher = async () => {
    const currentId = analysisData?.id;
    if (currentId) {
      await setActiveResumeId(currentId, 'resume-report');
    }

    let fileToPass = activeFile;
    if (!fileToPass || !(fileToPass instanceof File)) {
      const fn = fileName;
      const fileText = executiveSummary || 'Parsed candidate resume details.';
      const blob = new Blob([fileText], { type: 'application/pdf' });
      fileToPass = new File([blob], fn, { type: 'application/pdf' });
    }

    setSharedResumeFile(fileToPass);
    navigate('/app/job-matcher', { state: { fromResumeAnalyzer: true } });
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      
      {/* 1. Profile Name Sync Banner */}
      {showNameBanner && extractedName && (
        <div className="bg-[#161B22] border border-blue-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">
              <User className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-300">
              We found <strong className="text-white font-semibold">"{extractedName}"</strong> in your resume. Would you like to update your workspace profile?
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            <button
              onClick={() => {
                updateProfile({ name: extractedName });
                setShowNameBanner(false);
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Update Profile
            </button>
            <button
              onClick={() => setShowNameBanner(false)}
              className="px-3 py-1.5 bg-[#0D1117] hover:bg-[#21262d] text-gray-400 hover:text-white border border-[#30363D] text-xs font-medium rounded-xl transition-colors cursor-pointer"
            >
              Keep Current
            </button>
          </div>
        </div>
      )}

      {/* 2. Resume Report Header */}
      <PageHeader
        title="Resume Analysis Report"
        subtitle={`Analyzed ${formattedDate} • ${fileName}`}
        onBack={onReset}
        backLabel="Back to Resumes"
        actions={
          <>
            {/* <button
              onClick={handleContinueToJobMatcher}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Continue to Job Matcher</span>
              <ArrowRight className="w-4 h-4" />
            </button> */}

            <button
              onClick={onReset}
              className="px-3.5 py-2.5 bg-[#161B22] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
              <span>Analyze New Resume</span>
            </button>

            <button
              onClick={handleDownloadMarkdownReport}
              className="px-3.5 py-2.5 bg-[#161B22] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-gray-400" />
              <span>Download Report</span>
            </button>
          </>
        }
      />

      {/* 3. AI Verdict Card (Sleek, Neutral Border, High Contrast) */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-7 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#30363D]/60 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎯</span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              AI Verdict
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-gray-400 block font-medium">Current ATS</span>
              <span className="text-base font-mono font-bold text-white">{displayScore} / 100</span>
            </div>
            <div className="h-6 w-px bg-[#30363D]" />
            <div>
              <span className="text-xs text-gray-400 block font-medium">Target Potential</span>
              <span className="text-base font-mono font-bold text-emerald-400">{targetScoreRange} ATS</span>
            </div>
          </div>
        </div>

        {/* Short paragraph (2 lines max) */}
        <p className="text-base text-gray-300 leading-relaxed font-normal">
          "{aiVerdictParagraph}"
        </p>

        {/* Progress indicator bar */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between text-xs font-mono font-semibold">
            <span className="text-gray-400">Current ({displayScore} ATS)</span>
            <span className="text-emerald-400">Target Goal ({targetScoreRange} ATS)</span>
          </div>
          <div className="w-full bg-[#0D1117] h-2 rounded-full overflow-hidden border border-[#30363D] relative">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.min(100, Math.max(0, displayScore))}%` }} 
            />
            <div 
              className="absolute top-0 bottom-0 bg-emerald-500/40 border-l border-emerald-400 rounded-r-full" 
              style={{ left: `${Math.min(100, Math.max(0, displayScore))}%`, width: `${Math.min(30, 90 - displayScore)}%` }} 
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-1">
          <button
            onClick={scrollToRecommendations}
            className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Improve Resume</span>
          </button>
        </div>
      </div>

      {/* 4. Section 1: MERGED HORIZONTAL STATS PANEL (One Card, 3 Equal Columns) */}
      <div className="bg-[#161B22] rounded-2xl p-7 sm:p-8 border border-[#30363D] space-y-6 shadow-sm">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-400" />
          <span>Resume Overview</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Column 1: Resume Score */}
          <div className="md:pr-6 md:border-r md:border-[#30363D]/60 space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Resume Score
            </span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {displayScore} <span className="text-base font-normal text-gray-400">/ 100</span>
            </h3>
            <p className="text-xs text-gray-400 font-normal leading-relaxed">
              {interviewPotential}
            </p>
          </div>

          {/* Column 2: ATS Compatibility */}
          <div className="md:px-6 md:border-r md:border-[#30363D]/60 space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              ATS Compatibility
            </span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              {displayAtsScore}%
            </h3>
            <p className="text-xs text-emerald-400 font-normal leading-relaxed">
              Well Parsed by ATS
            </p>
          </div>

          {/* Column 3: Target Role */}
          <div className="md:pl-6 space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Target Role
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
              {primaryRoleMatch}
            </h3>
            <p className="text-xs text-gray-400 font-normal leading-relaxed">
              {secondaryRoleMatch}
            </p>
          </div>

        </div>
      </div>

      {/* 5. AI Summary (2 Equal Columns, Max 5 1-line bullets each) */}
      <div className="bg-[#161B22] rounded-2xl p-7 sm:p-8 border border-[#30363D] space-y-5 shadow-sm">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>AI Summary</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          
          {/* Column 1: Strengths */}
          <div className="p-5 rounded-xl bg-[#0D1117] border border-[#30363D]/60 space-y-3">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Strengths</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-300 font-normal">
              {strengthsBullets.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Needs Improvement */}
          <div className="p-5 rounded-xl bg-[#0D1117] border border-[#30363D]/60 space-y-3">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Needs Improvement</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-300 font-normal">
              {needsBullets.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* 6. Recommendations (High Priority Badges, Estimated ATS +9, Clean Spacing) */}
      <div id="recommendations" className="bg-[#161B22] rounded-2xl p-7 sm:p-8 border border-[#30363D] space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <span>Actionable Recommendations</span>
          </h2>
          <span className="text-xs font-mono font-medium text-blue-400 bg-blue-600/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
            {recommendations.length} Suggestions
          </span>
        </div>

        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.slice(0, 5).map((rec, idx) => {
              const title = typeof rec === 'string' ? rec : rec.title;
              const desc = typeof rec === 'string' ? '' : rec.description;
              const estimatedImpact = rec?.impact || `+${Math.min(9, 9 - idx * 2)}`;
              const isHighPriority = idx < 2;

              return (
                <div 
                  key={idx} 
                  className="p-5 sm:p-6 rounded-xl bg-[#0D1117] border border-[#30363D] flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-blue-500/40 transition-all duration-200 shadow-sm"
                >
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider ${isHighPriority ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' : 'bg-blue-600/10 border border-blue-500/30 text-blue-400'}`}>
                        {isHighPriority ? 'HIGH PRIORITY' : 'MEDIUM'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                        {estimatedImpact} ATS Gain
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {title}
                    </h3>
                    
                    {desc && (
                      <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">
                        {desc}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No specific recommendations suggested.</p>
        )}
      </div>

      {/* 7 & 8. Key Strengths vs Keyword Gaps (GitHub Topic Badges) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Key Strengths (Clean List, Green Icon, Neutral Border) */}
        <div className="bg-[#161B22] rounded-2xl p-7 sm:p-8 border border-[#30363D] space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#30363D]/60">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Key Strengths</span>
            </h2>
            <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {strengths.length} Highlighted
            </span>
          </div>

          {strengths.length > 0 ? (
            <div className="space-y-2.5 pt-1">
              {strengths.slice(0, 5).map((item, idx) => {
                const label = typeof item === 'string' ? item : item.title;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D]/60 text-sm text-gray-200 font-normal flex items-center gap-2.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No specific strengths highlighted.</p>
          )}
        </div>

        {/* Keyword Gaps (GitHub Topic Tag Style Badges) */}
        <div className="bg-[#161B22] rounded-2xl p-7 sm:p-8 border border-[#30363D] space-y-4 shadow-sm">
          <div className="pb-3 border-b border-[#30363D]">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Keyword Gaps</h2>
              <span className="text-xs font-mono font-medium text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                {missingSkills.length} Missing
              </span>
            </div>
            <p className="text-xs text-gray-400 font-normal mt-1">
              Critical technical skills missing compared to target job descriptions.
            </p>
          </div>

          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2.5 pt-2">
              {missingSkills.map((item, idx) => {
                const name = typeof item === 'string' ? item : item.name;
                return (
                  <div
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-[#0D1117] text-amber-300 border border-amber-500/25 text-xs font-mono font-semibold inline-flex items-center gap-2 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span>{name}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No critical missing keywords identified.</p>
          )}
        </div>

      </div>

      {/* 10. Next Step Card (Ready for Job Matching? Premium Centered CTA) */}
      <div className="bg-[#161B22] rounded-2xl p-8 sm:p-10 border border-[#30363D] flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <Zap className="w-6 h-6" />
        </div>

        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl font-bold text-white tracking-tight">Ready for Job Matching?</h2>
          <p className="text-sm text-gray-400 font-normal leading-relaxed">
            Compare this resume against a job description to uncover missing skills and improve your ATS score.
          </p>
        </div>

        <button
          onClick={handleContinueToJobMatcher}
          className="mt-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Continue to Job Matcher</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
