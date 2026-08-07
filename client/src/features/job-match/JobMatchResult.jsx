import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Lightbulb, 
  RefreshCw, 
  Tag, 
  Copy,
  Check,
  Download,
  Info,
  ArrowRight
} from 'lucide-react';
import { Toast } from '../../components/Toast';
import { useWorkspace } from '../../context/WorkspaceContext';

export const JobMatchResult = ({ resultData, matchData, jobTitle, filename, onReset }) => {
  const navigate = useNavigate();
  const { profile, setRoadmapSeed } = useWorkspace();
  const isPlatformObjective = (str) => {
    if (!str) return true;
    const lower = str.toLowerCase();
    return lower.includes('get a job') || lower.includes('learn new skills') || lower.includes('improve my resume') || lower.includes('prepare for interview');
  };

  const [toastMsg, setToastMsg] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);
  const [removedSkills, setRemovedSkills] = useState([]);
  const [displayScore, setDisplayScore] = useState(0);

  // Normalize data payload supporting both resultData and matchData prop names + key variations
  const data = resultData || matchData || {};

  const matchScore = data.matchScore ?? data.matchPercentage ?? data.overallScore ?? 85;
  const matchingSkills = Array.isArray(data.matchingSkills) ? data.matchingSkills : (Array.isArray(data.matchedSkills) ? data.matchedSkills : []);
  const missingSkills = Array.isArray(data.missingSkills) ? data.missingSkills : (Array.isArray(data.skillsMissing) ? data.skillsMissing : []);
  const resumeImprovements = Array.isArray(data.resumeImprovements) 
    ? data.resumeImprovements 
    : (Array.isArray(data.recommendations) ? data.recommendations : (Array.isArray(data.tailoringRecommendations) ? data.tailoringRecommendations : []));
  const hiringSummary = data.hiringSummary || data.summary || data.matchSummary || "Candidate demonstrates strong technical alignment with target position requirements.";

  // Animated Score Counter
  useEffect(() => {
    let start = 0;
    const end = matchScore;
    const duration = 1000;
    const incrementTime = 20;
    const stepCount = duration / incrementTime;
    const increment = (end - start) / stepCount;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [matchScore]);

  const getMatchCategory = (val) => {
    if (val >= 95) return { label: 'Excellent Match', color: '#10b981', textColor: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' };
    if (val >= 80) return { label: 'Strong Match', color: '#3b82f6', textColor: 'text-blue-400', badgeBg: 'bg-blue-500/10 border-blue-500/30 text-blue-300' };
    if (val >= 65) return { label: 'Good Match', color: '#06b6d4', textColor: 'text-cyan-400', badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' };
    if (val >= 50) return { label: 'Moderate Match', color: '#f59e0b', textColor: 'text-amber-400', badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300' };
    return { label: 'Needs Improvement', color: '#f43f5e', textColor: 'text-rose-400', badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-300' };
  };

  const matchCategory = getMatchCategory(matchScore);
  const activeMissingSkills = missingSkills.filter((s) => !removedSkills.includes(s));

  const triggerCopy = (text, sectionKey) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSection(sectionKey);
      setToastMsg('Copied to clipboard.');
      setTimeout(() => setCopiedSection(null), 2500);
    }
  };

  const handleCopySummary = () => {
    triggerCopy(`SUMMARY:\n${hiringSummary}`, 'summary');
  };

  const handleCopyMissingSkills = () => {
    triggerCopy(`MISSING SKILLS:\n${activeMissingSkills.map(s => `- ${s}`).join('\n')}`, 'missingSkills');
  };

  const handleCopyImprovements = () => {
    triggerCopy(`RESUME IMPROVEMENTS:\n${resumeImprovements.map((imp, idx) => `${idx + 1}. ${imp}`).join('\n')}`, 'improvements');
  };

  const renderProgressCircle = (value, size = 140, strokeWidth = 10) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90" aria-label={`Job match gauge ${value} percent`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={matchCategory.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tight ${matchCategory.textColor}`}>
            {value}%
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
            MATCH SCORE
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn printable-report relative" role="region" aria-label="Job Match Result">
      
      {/* Toast Notification */}
      {toastMsg && (
        <Toast
          message={toastMsg}
          onClose={() => setToastMsg(null)}
          duration={2500}
        />
      )}

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">
            Role: <strong className="text-white">{jobTitle}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            aria-label="Export PDF"
            className="px-3.5 py-1.5 glass-card hover:bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white rounded-xl flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" /> Export PDF
          </button>
          <button
            onClick={onReset}
            aria-label="Analyze another job description"
            className="px-3.5 py-1.5 glass-card hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white rounded-xl flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" /> New Match
          </button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="glass-card rounded-3xl p-6 border border-blue-500/30 bg-slate-950/40 grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-xl">
        <div className="flex justify-center md:justify-start">
          {renderProgressCircle(displayScore, 140, 10)}
        </div>

        <div className="md:col-span-2 space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300">
            <Target className="w-3.5 h-3.5 text-blue-400" />
            <span>Job Matcher Evaluation</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Job Match Score: <span className="text-blue-400 font-mono">{displayScore}%</span>
          </h2>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className={`px-3 py-0.5 rounded-full border text-xs font-bold ${matchCategory.badgeBg}`}>
              {matchCategory.label}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            {hiringSummary}
          </p>
        </div>
      </div>

      {/* Skills Match Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Matching Skills */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Matching Skills ({matchingSkills.length})
          </h3>

          {matchingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchingSkills.map((sk, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                  ✓ {sk}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No matching skills identified.</p>
          )}
        </div>

        {/* Missing Skills */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              Missing Skills ({activeMissingSkills.length})
            </h3>
            {activeMissingSkills.length > 0 && (
              <button
                onClick={handleCopyMissingSkills}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 transition-colors cursor-pointer"
              >
                {copiedSection === 'missingSkills' ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'missingSkills' ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {activeMissingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeMissingSkills.map((sk, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300">
                  ✗ {sk}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No missing skills detected.</p>
          )}
        </div>

      </div>

      {/* Recommended Resume Improvements */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            Tailoring Recommendations ({resumeImprovements.length})
          </h3>
          {resumeImprovements.length > 0 && (
            <button
              onClick={handleCopyImprovements}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 transition-colors cursor-pointer"
            >
              {copiedSection === 'improvements' ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'improvements' ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>

        {resumeImprovements.length > 0 ? (
          <div className="space-y-2.5">
            {resumeImprovements.map((imp, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-200 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{typeof imp === 'string' ? imp : imp.recommendation || imp.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No specific tailoring recommendations generated.</p>
        )}
      </div>

      {/* Recommended Next Step Success Card */}
      <div className="bg-[#161B22] border-2 border-blue-500/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              🎯 Stage 2 Complete
            </span>
            <h3 className="text-lg font-extrabold text-white mt-1">Job Match Complete</h3>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Your resume matches <strong className="text-blue-400 font-mono font-bold">{matchScore}%</strong> of the selected target job description. We'll now build a personalized roadmap to close the remaining skill gaps.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => {
              const seed = {
                source: "jobMatcher",
                targetRole: jobTitle || "Frontend Developer",
                currentSkills: matchingSkills.length > 0 ? matchingSkills : ["React", "JavaScript", "HTML", "CSS", "Git"],
                missingSkills: activeMissingSkills.length > 0 ? activeMissingSkills : (missingSkills.length > 0 ? missingSkills : ["TypeScript", "Testing", "Next.js", "Performance Optimization", "REST API Design"]),
                missingKeywords: activeMissingSkills || [],
                matchScore: matchScore || 75,
                atsScore: data.atsScore || matchScore || 75,
                experienceLevel: null
              };

              setRoadmapSeed(seed);

              navigate('/app/roadmap', {
                state: {
                  fromJobMatcher: true
                }
              });
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Generate Learning Roadmap</span>
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

    </div>
  );
};
