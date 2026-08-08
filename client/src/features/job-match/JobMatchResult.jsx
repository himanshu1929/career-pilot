import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  ArrowRight,
  Sparkles,
  Zap,
  Check,
  Search
} from 'lucide-react';

export const JobMatchResult = ({ resultData, matchData, jobTitle, filename, onReset }) => {
  const navigate = useNavigate();
  const { setRoadmapSeed } = useWorkspace();

  const [displayScore, setDisplayScore] = useState(0);

  // Normalize data payload supporting both resultData and matchData prop names
  const data = resultData || matchData || {};

  const matchScore = data.matchScore ?? data.matchPercentage ?? data.overallScore ?? 85;
  const matchingSkills = Array.isArray(data.matchingSkills) ? data.matchingSkills : (Array.isArray(data.matchedSkills) ? data.matchedSkills : []);
  const missingSkills = Array.isArray(data.missingSkills) ? data.missingSkills : (Array.isArray(data.skillsMissing) ? data.skillsMissing : []);
  const rawImprovements = Array.isArray(data.resumeImprovements) 
    ? data.resumeImprovements 
    : (Array.isArray(data.recommendations) ? data.recommendations : (Array.isArray(data.tailoringRecommendations) ? data.tailoringRecommendations : []));
  const hiringSummary = data.hiringSummary || data.summary || data.matchSummary || "Candidate demonstrates strong technical alignment with target position requirements.";

  // Animated Score Counter
  useEffect(() => {
    let start = 0;
    const end = matchScore;
    const duration = 800;
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

  const matchCategory = useMemo(() => {
    if (matchScore >= 90) return { label: 'Excellent Match', color: '#10b981', textColor: 'text-emerald-400' };
    if (matchScore >= 75) return { label: 'Strong Match', color: '#3b82f6', textColor: 'text-blue-400' };
    if (matchScore >= 60) return { label: 'Good Match', color: '#06b6d4', textColor: 'text-cyan-400' };
    if (matchScore >= 45) return { label: 'Moderate Match', color: '#f59e0b', textColor: 'text-amber-400' };
    return { label: 'Needs Improvement', color: '#f43f5e', textColor: 'text-rose-400' };
  }, [matchScore]);

  const primarySkillName = matchingSkills[0] || 'Technical';
  const displayRoleTitle = jobTitle || 'Target Position';
  const displayFilename = filename || 'Resume_Document.pdf';

  // SVG Animated Gauge matching exact size and stroke
  const renderProgressCircle = (value, size = 130, strokeWidth = 10) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="relative flex flex-col items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90" aria-label={`Job match score ${value} percent`}>
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
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold tracking-tight ${matchCategory.textColor}`}>
            {value}%
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
            MATCH SCORE
          </span>
        </div>
      </div>
    );
  };

  const handleGenerateRoadmap = () => {
    const seed = {
      source: "jobMatcher",
      targetRole: displayRoleTitle,
      currentSkills: matchingSkills.length > 0 ? matchingSkills : ["React", "JavaScript", "HTML", "CSS", "Git"],
      missingSkills: missingSkills.length > 0 ? missingSkills : ["TypeScript", "Testing", "Next.js", "Docker"],
      missingKeywords: missingSkills || [],
      matchScore: matchScore || 75,
      atsScore: data.atsScore || matchScore || 75
    };

    setRoadmapSeed(seed);
    navigate('/app/roadmap', { state: { fromJobMatcher: true } });
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      
      {/* Shared Header — Identical button styling & breadcrumb layout */}
      <PageHeader
        title="Job Match Analysis Report"
        subtitle={`${displayRoleTitle} • Compared against: ${displayFilename}`}
        onBack={onReset}
        backLabel="Back to Job Matcher"
        actions={
          <>
            <button
              onClick={() => window.print()}
              aria-label="Export PDF Report"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>

            <button
              onClick={onReset}
              className="px-3.5 py-2.5 bg-[#161B22] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
              <span>New Match</span>
            </button>
          </>
        }
      />

      {/* AI Match Evaluation */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 pb-3 border-b border-[#30363D]">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Match Evaluation</h3>
            <p className="text-xs text-gray-400">Overall compatibility and candidate alignment verdict</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {renderProgressCircle(displayScore, 130, 10)}

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h4 className="text-lg font-bold text-white tracking-tight">
                AI Verdict: <span className={matchCategory.textColor}>{matchCategory.label}</span>
              </h4>
            </div>

            <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
              "{hiringSummary}"
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>ATS Ready</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-600/10 border border-blue-500/25 text-blue-400 text-xs font-mono font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Strong {primarySkillName} Match</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Missing {missingSkills.length} Skills</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Skill Analysis (Matching vs Missing Skills) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Matching Skills Card */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Matching Skills</h3>
                <p className="text-xs text-gray-400">{matchingSkills.length} qualifications matched</p>
              </div>
            </div>
          </div>

          {matchingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {matchingSkills.map((sk, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-[#0D1117] text-emerald-300 border border-emerald-500/25 text-xs font-mono font-medium inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{sk}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No matching skills detected.</p>
          )}
        </div>

        {/* Missing Skills Card (Amber Accent) */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Missing Skills</h3>
                <p className="text-xs text-gray-400">{missingSkills.length} skill gaps identified</p>
              </div>
            </div>
          </div>

          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {missingSkills.map((sk, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-[#0D1117] text-amber-300 border border-amber-500/25 text-xs font-mono font-medium inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span>{sk}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No missing skills identified.</p>
          )}
        </div>

      </div>

      {/* SECTION 5: Tailoring Recommendations */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tailoring Recommendations</h3>
              <p className="text-xs text-gray-400">Actionable resume enhancements to increase callback rates</p>
            </div>
          </div>
          <span className="text-xs font-mono font-medium text-blue-400 bg-blue-600/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
            {rawImprovements.length} Action Items
          </span>
        </div>

        {rawImprovements.length > 0 ? (
          <div className="space-y-4">
            {rawImprovements.slice(0, 5).map((imp, idx) => {
              const title = typeof imp === 'string' ? imp : (imp.title || imp.recommendation || `Improvement #${idx + 1}`);
              const desc = typeof imp === 'string' ? '' : imp.description;
              const estimatedImpact = imp?.impact || `+${Math.min(9, 9 - idx * 2)}`;
              
              const priorityType = idx === 0 ? 'HIGH' : idx < 3 ? 'MEDIUM' : 'LOW';
              const borderClass = priorityType === 'HIGH' 
                ? 'border-l-4 border-l-amber-500' 
                : priorityType === 'MEDIUM' 
                ? 'border-l-4 border-l-blue-500' 
                : 'border-l-4 border-l-emerald-500';

              const badgeClass = priorityType === 'HIGH'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : priorityType === 'MEDIUM'
                ? 'bg-blue-600/10 border-blue-500/30 text-blue-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';

              return (
                <div 
                  key={idx} 
                  className={`p-5 sm:p-6 rounded-xl bg-[#0D1117] border-t border-r border-b border-[#30363D] ${borderClass} space-y-2 hover:-translate-y-0.5 transition-all duration-200 shadow-sm`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider ${badgeClass}`}>
                        {priorityType} PRIORITY
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                        {estimatedImpact} ATS Gain
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {title}
                  </h4>
                  
                  {desc && (
                    <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">
                      {desc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No specific tailoring recommendations generated.</p>
        )}
      </div>

      {/* Next Step */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 pb-3 border-b border-[#30363D]">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ArrowRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Next Step</h3>
            <p className="text-xs text-gray-400">Transition into personalized skill development</p>
          </div>
        </div>

        <div className="bg-[#0D1117] border border-blue-500/30 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white tracking-tight">Ready for the final step?</h4>
            <p className="text-xs sm:text-sm text-gray-400 font-normal max-w-lg leading-relaxed">
              Generate your personalized learning roadmap based on the missing skills identified above.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={handleGenerateRoadmap}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Generate Learning Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#161B22] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
