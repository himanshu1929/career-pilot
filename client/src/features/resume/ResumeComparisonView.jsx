import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  AlertTriangle,
  FileCheck,
  Zap
} from 'lucide-react';

export const ResumeComparisonView = ({ previousAnalysis, currentAnalysis, filename }) => {
  if (!previousAnalysis || !currentAnalysis) return null;

  const prevScore = previousAnalysis.score || 0;
  const currentScore = currentAnalysis.score || 0;
  const scoreDiff = currentScore - prevScore;

  const prevAts = previousAnalysis.atsScore || 0;
  const currentAts = currentAnalysis.atsScore || 0;
  const atsDiff = currentAts - prevAts;

  const prevWeaknesses = previousAnalysis.weaknesses || [];
  const currentWeaknesses = currentAnalysis.weaknesses || [];
  const currentStrengths = currentAnalysis.strengths || [];
  const prevStrengths = previousAnalysis.strengths || [];

  // Find resolved weaknesses (flaws in previous version not in current version)
  const resolvedWeaknesses = prevWeaknesses.filter(
    (pw) => !currentWeaknesses.some((cw) => cw.toLowerCase().includes(pw.toLowerCase().slice(0, 15)))
  );

  // Find new strengths
  const newStrengths = currentStrengths.filter(
    (cs) => !prevStrengths.some((ps) => ps.toLowerCase().includes(cs.toLowerCase().slice(0, 15)))
  );

  const getDiffBadge = (diff) => {
    if (diff > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs font-mono">
          <ArrowUpRight className="w-3.5 h-3.5" /> +{diff} pts
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 font-extrabold text-xs font-mono">
          <TrendingDown className="w-3.5 h-3.5" /> {diff} pts
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 text-slate-400 font-bold text-xs font-mono">
        No Change
      </span>
    );
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 via-slate-900/60 to-slate-950/80 space-y-6 shadow-2xl animate-fadeIn">
      
      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-300 mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Resume Iteration comparison</span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Version Improvement Summary
            </h2>
          </div>
        </div>

        <div className="text-xs text-slate-300 font-mono bg-slate-950/60 px-3 py-1.5 rounded-xl border border-white/10">
          Comparing: <strong className="text-emerald-400">{filename}</strong>
        </div>
      </div>

      {/* Side-by-Side Score Delta Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Overall Resume Score Diff */}
        <div className="glass-card rounded-2xl p-5 border border-indigo-500/20 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">Overall Resume Score</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-slate-400 line-through text-xs font-mono">{prevScore}</span>
                <span className="text-white font-extrabold text-lg">{currentScore} / 100</span>
              </div>
            </div>
          </div>
          {getDiffBadge(scoreDiff)}
        </div>

        {/* ATS Score Diff */}
        <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">ATS Parsing Score</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-slate-400 line-through text-xs font-mono">{prevAts}</span>
                <span className="text-white font-extrabold text-lg">{currentAts} / 100</span>
              </div>
            </div>
          </div>
          {getDiffBadge(atsDiff)}
        </div>

      </div>

      {/* Detailed Diff Breakdown: Resolved Flaws & New Strengths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Resolved Weaknesses */}
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
          <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Resolved Weaknesses ({resolvedWeaknesses.length})</span>
          </h4>

          {resolvedWeaknesses.length > 0 ? (
            <div className="space-y-2">
              {resolvedWeaknesses.map((rw, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-xs text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{rw}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No previous weaknesses completely removed yet.</p>
          )}
        </div>

        {/* New Strengths Identified */}
        <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30">
          <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>New Strengths Identified ({newStrengths.length})</span>
          </h4>

          {newStrengths.length > 0 ? (
            <div className="space-y-2">
              {newStrengths.map((ns, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-slate-200">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{ns}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Existing core strengths preserved.</p>
          )}
        </div>

      </div>

      {/* Executive Improvement Summary */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-200 leading-relaxed">
        <strong className="text-emerald-400 font-bold block mb-1">💡 Iteration Insight:</strong>
        {scoreDiff > 0
          ? `Great job! Your latest edits improved your overall resume score by ${scoreDiff} points. ${resolvedWeaknesses.length} previous formatting or skill gaps were successfully resolved.`
          : scoreDiff === 0
          ? `Your latest upload maintains a steady high quality score of ${currentScore}/100. Review remaining recommendations to push your score to 95+.`
          : `Your score shifted slightly (${scoreDiff} points). Check the updated recommendation list below to optimize your latest version.`}
      </div>

    </div>
  );
};
