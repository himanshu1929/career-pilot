import React, { useState, useMemo } from 'react';
import { 
  Plus,
  FileText, 
  Search, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Sparkles, 
  Award, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  X,
  History
} from 'lucide-react';
import { formatHistoryDate } from '../../utils/historyStorage';

export const ResumeHistoryList = ({ 
  history = [], 
  onViewReport, 
  onSelect,
  onAnalyzeAgain, 
  onIterate,
  onDeleteItem, 
  onDelete,
  onClearAll, 
  onClear,
  onToggleUploader,
  isUploaderOpen = false
}) => {
  // Resilient callback resolution supporting both naming conventions
  const handleView = onViewReport || onSelect || (() => {});
  const handleAnalyze = onAnalyzeAgain || onIterate || (() => {});
  const handleDelete = onDeleteItem || onDelete || (() => {});
  const handleClear = onClearAll || onClear || (() => {});

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('All');

  const [deletingItem, setDeletingItem] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter & Sort Logic (Newest first)
  const filteredHistory = useMemo(() => {
    return [...history]
      .sort((a, b) => new Date(b.lastUpdated || b.uploadedAt || b.timestamp) - new Date(a.lastUpdated || a.uploadedAt || a.timestamp))
      .filter((item) => {
        const fname = item.filename || item.originalName || 'Resume.pdf';
        const matchesSearch = fname.toLowerCase().includes(searchTerm.toLowerCase().trim());
        if (!matchesSearch) return false;

        const score = item.resumeScore || item.score || 0;
        if (filterTier === 'Excellent') return score >= 90;
        if (filterTier === 'Strong') return score >= 80 && score < 90;
        if (filterTier === 'Average') return score >= 70 && score < 80;
        if (filterTier === 'Needs Improvement') return score < 70;
        return true;
      });
  }, [history, searchTerm, filterTier]);

  const getScoreBadgeClass = (val) => {
    if (val >= 90) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    if (val >= 80) return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
    if (val >= 70) return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
    return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
  };

  // Render Status Badge
  const renderStatusBadge = (item) => {
    const versions = item.versionHistory || item.versions || [];
    if (versions.length <= 1 && item.statusType !== 'improved' && item.statusType !== 'decreased') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-semibold">
          Initial Scan
        </span>
      );
    }

    if (item.statusType === 'no_change') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-bold flex items-center gap-1">
          <Minus className="w-3 h-3" /> No Changes
        </span>
      );
    }

    if (item.statusType === 'decreased') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1">
          <ArrowDownRight className="w-3 h-3 text-amber-400" />
          <span>Needs Review ({item.scoreDiff >= 0 ? `+${item.scoreDiff}` : item.scoreDiff})</span>
        </span>
      );
    }

    return (
      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1.5">
        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
        {item.scoreDiff >= 0 ? `+${item.scoreDiff}` : item.scoreDiff}
        {item.atsDiff > 0 && <span className="opacity-80">↑ ATS +{item.atsDiff}</span>}
      </span>
    );
  };

  return (
    <div className="space-y-6 pt-2">
      
      {/* Section Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#30363D]">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Resume History</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 font-mono font-bold">
              {history.length} Saved {history.length === 1 ? 'Version' : 'Versions'}
            </span>
          </h2>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3.5 py-2 bg-[#161B22] hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all border border-rose-500/20 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {/* Controls Bar: Search & Filter Chips */}
      {history.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by resume filename..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['All', 'Excellent', 'Strong', 'Average', 'Needs Improvement'].map((chip) => {
                const isActive = filterTier === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => setFilterTier(chip)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white border border-indigo-400 shadow-md shadow-indigo-500/20'
                        : 'glass-card text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* History Cards Grid */}
      {filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHistory.map((item) => {
            const versions = item.versionHistory || item.versions || [];
            const rScore = item.resumeScore || item.score || 88;
            const aScore = item.atsScore || 90;
            const formattedDate = formatHistoryDate(item.lastUpdated || item.uploadedAt || item.timestamp);
            const analysisObj = item.analysis || item.analysisData || item;

            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/40 hover:bg-slate-900/70 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:-translate-y-1"
              >
                <div>
                  {/* Top Row: Filename & Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white break-all" title={item.filename}>
                            {item.filename}
                          </h3>
                          {renderStatusBadge(item)}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 font-mono">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setDeletingItem(item)}
                      title="Delete item"
                      aria-label={`Delete ${item.filename} from history`}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer focus-visible:outline-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Scores Row */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${getScoreBadgeClass(rScore)}`}>
                      <Award className="w-3.5 h-3.5" />
                      <span>Resume Score: {rScore}/100</span>
                    </div>

                    <div className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${getScoreBadgeClass(aScore)}`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>ATS: {aScore}/100</span>
                    </div>
                  </div>

                  {/* One-Line Summary */}
                  {item.oneLineSummary && (
                    <div className="text-[11px] text-emerald-300/90 font-medium mb-3 flex items-center gap-1.5 bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <Sparkles className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span className="leading-snug">{item.oneLineSummary}</span>
                    </div>
                  )}

                  {/* Version Progression Timeline */}
                  {versions.length > 1 && (
                    <div className="mb-3 p-2 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-2 text-[10px] font-mono text-slate-400 overflow-x-auto">
                      <History className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                      <span className="text-slate-500 font-bold">Timeline:</span>
                      {versions.map((v, idx) => (
                        <React.Fragment key={idx}>
                          <span className={`px-1.5 py-0.5 rounded ${idx === versions.length - 1 ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30' : 'bg-slate-900 text-slate-400'}`}>
                            v{v.versionNum} ({v.score})
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {/* Candidate Level */}
                  <div className="mb-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[11px] font-medium">
                      🎯 {item.candidateLevel || 'Assessed Candidate'}
                    </span>
                  </div>

                  {/* Executive Summary */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4 bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    {item.executiveSummary || 'Scanned ATS report summary available.'}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleView(analysisObj)}
                    aria-label={`View analysis report for ${item.filename}`}
                    className="flex-1 py-2 px-3 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Report</span>
                  </button>

                  <button
                    onClick={() => handleAnalyze(item.filename)}
                    aria-label={`Analyze ${item.filename} again`}
                    className="px-3 py-2 glass-card hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Analyze Again</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Compact Centered Empty State */
        <div className="bg-[#161B22] rounded-2xl p-6 sm:p-8 text-center max-w-sm mx-auto border border-[#30363D] my-6 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white tracking-tight">
              {searchTerm || filterTier !== 'All' ? 'No matching resumes found.' : 'No resumes yet'}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
              {searchTerm || filterTier !== 'All'
                ? 'Try adjusting your search terms or filter chips above.'
                : 'Upload your first resume to begin building your AI career profile.'}
            </p>
          </div>
          {!(searchTerm || filterTier !== 'All') && onToggleUploader && (
            <button
              onClick={onToggleUploader}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Resume</span>
            </button>
          )}
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card rounded-2xl p-6 max-w-sm w-full border border-rose-500/30 bg-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Delete Resume Analysis?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to remove <strong className="text-white">{deletingItem.filename}</strong> from your analysis history?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white glass-card border border-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(deletingItem.id);
                  setDeletingItem(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card rounded-2xl p-6 max-w-sm w-full border border-rose-500/30 bg-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Clear All History?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will permanently delete all <strong className="text-white">{history.length} saved resume analyses</strong> from local storage.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white glass-card border border-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleClear();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
