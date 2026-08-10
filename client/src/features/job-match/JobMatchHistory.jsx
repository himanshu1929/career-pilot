import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Search, 
  Trash2, 
  Eye, 
  Sparkles, 
  Map, 
  Mic, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Filter, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const JobMatchHistory = ({ onSelectReport }) => {
  const navigate = useNavigate();
  const { jobMatches = [], deleteJobMatch, roadmaps = [], interviews = [], setRoadmapSeed } = useWorkspace();

  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all'); // all | high | medium | low
  const [sortBy, setSortBy] = useState('newest'); // newest | oldest
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filter and Sort Job Matches
  const filteredMatches = useMemo(() => {
    return jobMatches
      .filter((item) => {
        // Search term filter (Company Name, Job Title, or Resume Name)
        const q = searchTerm.toLowerCase().trim();
        const company = (item.companyName || 'Target Company').toLowerCase();
        const role = (item.targetJobTitle || item.jobTitle || '').toLowerCase();
        const resume = (item.resumeFileName || '').toLowerCase();

        const matchesSearch = !q || company.includes(q) || role.includes(q) || resume.includes(q);

        // Match Score filter
        const score = Number(item.matchScore ?? item.overallScore ?? item.score ?? 0);
        let matchesScore = true;
        if (scoreFilter === 'high') matchesScore = score >= 85;
        if (scoreFilter === 'medium') matchesScore = score >= 60 && score < 85;
        if (scoreFilter === 'low') matchesScore = score < 60;

        return matchesSearch && matchesScore;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp || a.dateIso || 0).getTime();
        const timeB = new Date(b.timestamp || b.dateIso || 0).getTime();
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [jobMatches, searchTerm, scoreFilter, sortBy]);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteJobMatch(id);
    setDeleteConfirmId(null);
  };

  const handleGenerateRoadmap = (item, e) => {
    e.stopPropagation();
    const role = item.targetJobTitle || item.jobTitle || 'Target Role';
    const missingSkills = item.missingSkills || item.analysisResult?.missingSkills || [];
    
    setRoadmapSeed({
      source: 'jobMatcher',
      targetRole: role,
      companyName: item.companyName || 'Target Company',
      missingSkills,
      matchScore: item.matchScore || item.overallScore || 85,
      timestamp: item.timestamp
    });

    navigate('/app/roadmap');
  };

  const handleGoToMockInterview = (item, e) => {
    e.stopPropagation();
    const role = item.targetJobTitle || item.jobTitle || 'Target Role';
    navigate('/app/mock-interview', { state: { prefilledRole: role } });
  };

  if (!jobMatches || jobMatches.length === 0) {
    return (
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 text-center space-y-3.5 shadow-sm mt-8">
        <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
          <Target className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white tracking-tight">No job matches yet</h3>
          <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
            Compare your resume against a job description.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-10 animate-fadeIn">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#30363D]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span>Job Match History</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold">
              {jobMatches.length} {jobMatches.length === 1 ? 'Report' : 'Reports'}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Revisit saved job match reports, track learning progress, and launch targeted roadmaps or interviews.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search company or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#0D1117] border border-[#30363D] focus:border-blue-500/60 rounded-xl text-xs text-white placeholder-gray-500 outline-none w-48 transition-all"
            />
          </div>

          {/* Score Filter */}
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#0D1117] border border-[#30363D] focus:border-blue-500/60 rounded-xl text-xs text-gray-300 outline-none cursor-pointer"
          >
            <option value="all">All Match Scores</option>
            <option value="high">High Match (≥85%)</option>
            <option value="medium">Medium (60–84%)</option>
            <option value="low">Low Match (&lt;60%)</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-[#0D1117] border border-[#30363D] focus:border-blue-500/60 rounded-xl text-xs text-gray-300 outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* History Card Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((item) => {
            const role = item.targetJobTitle || item.jobTitle || 'Target Position';
            const company = item.companyName || 'Target Company';
            const score = Number(item.matchScore ?? item.overallScore ?? item.score ?? 85);
            const missingSkills = item.missingSkills || item.analysisResult?.missingSkills || [];
            const resumeName = item.resumeFileName || 'Uploaded Resume';
            const dateStr = item.formattedDate || new Date(item.timestamp || Date.now()).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
            const timeStr = item.formattedTime || new Date(item.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Associated Roadmap & Interview Status
            const existingRoadmap = roadmaps.find(
              (r) => (r.targetRole || '').toLowerCase() === role.toLowerCase() || r.roadmapId === item.roadmapId
            );
            const hasRoadmap = Boolean(existingRoadmap || item.roadmapGenerated);

            const existingInterview = interviews.find(
              (i) => (i.targetRole || '').toLowerCase() === role.toLowerCase() || i.id === item.interviewId
            );
            const hasInterview = Boolean(existingInterview || item.interviewCompleted);

            const isScoreHigh = score >= 85;
            const isScoreMed = score >= 60 && score < 85;

            return (
              <div
                key={item.id}
                className="bg-[#161B22] border border-[#30363D] hover:border-blue-500/40 rounded-2xl p-5 space-y-4 shadow-lg transition-all duration-200 relative group flex flex-col justify-between"
              >
                
                <div className="space-y-3">
                  {/* Top Card Bar: Company Name, Role Badge, Delete */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 truncate">
                          {company}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          {dateStr} • {timeStr}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-white tracking-tight truncate" title={role}>
                        {role}
                      </h3>
                    </div>

                    {/* Delete Confirmation / Trigger */}
                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-1.5 flex-shrink-0 animate-fadeIn">
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                          className="px-2 py-1 bg-[#0D1117] text-gray-400 hover:text-white text-[11px] rounded-lg transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(item.id); }}
                        className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Resume Used Subtitle */}
                  <div className="text-xs text-gray-400 flex items-center gap-1.5 truncate pt-0.5">
                    <FileText className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                    <span>Resume: <strong className="text-gray-300 font-medium truncate">{resumeName}</strong></span>
                  </div>

                  {/* Score & Missing Skills Badges */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <div className={`px-3 py-1 rounded-xl text-xs font-mono font-extrabold flex items-center gap-1.5 border ${
                      isScoreHigh
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : isScoreMed
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      <Target className="w-3.5 h-3.5" />
                      <span>{score}% Match</span>
                    </div>

                    <div className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-[#0D1117] text-gray-300 border border-[#30363D]">
                      <span>{missingSkills.length} Missing Skills</span>
                    </div>
                  </div>

                  {/* Workflow Status Badges */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#30363D] flex-wrap text-xs">
                    {hasRoadmap ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Roadmap Generated</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 bg-[#0D1117] px-2.5 py-0.5 rounded-full border border-[#30363D]">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span>Roadmap Pending</span>
                      </span>
                    )}

                    {hasInterview ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Interview Completed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 bg-[#0D1117] px-2.5 py-0.5 rounded-full border border-[#30363D]">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span>Interview Pending</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons Bar */}
                <div className="pt-4 border-t border-[#30363D] flex flex-wrap items-center justify-between gap-2">
                  
                  {/* Primary View Report Button */}
                  <button
                    onClick={() => onSelectReport(item)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Report</span>
                  </button>

                  {/* Contextual Workflow Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {hasRoadmap ? (
                      <button
                        onClick={() => navigate('/app/roadmap')}
                        className="px-3 py-2 bg-[#0D1117] hover:bg-[#21262d] text-purple-400 hover:text-purple-300 border border-purple-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Map className="w-3.5 h-3.5" />
                        <span>View Roadmap</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleGenerateRoadmap(item, e)}
                        className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Generate Roadmap</span>
                      </button>
                    )}

                    {hasInterview ? (
                      <button
                        onClick={(e) => handleGoToMockInterview(item, e)}
                        className="px-3 py-2 bg-[#0D1117] hover:bg-[#21262d] text-blue-400 hover:text-blue-300 border border-blue-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Interview Feedback</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleGoToMockInterview(item, e)}
                        className="px-3 py-2 bg-[#0D1117] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5 text-blue-400" />
                        <span>Mock Interview</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 text-center space-y-3">
          <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
          <p className="text-xs text-gray-300 font-medium">No job match reports match your search criteria.</p>
          <button
            onClick={() => { setSearchTerm(''); setScoreFilter('all'); }}
            className="px-3 py-1.5 bg-[#0D1117] text-blue-400 hover:text-blue-300 text-xs font-semibold rounded-xl border border-blue-500/30 cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      )}

    </div>
  );
};
