import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { generateLearningRecommendations } from '../../utils/interviewGenerator';
import { 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  ArrowLeft, 
  RefreshCw, 
  ExternalLink,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Map,
  Play,
  Check,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const InterviewSummary = ({ setupData, history, onRestart }) => {
  const navigate = useNavigate();
  const { profile, computedStats } = useWorkspace();
  const candidateName = profile?.name || 'Candidate';

  const [replayOpen, setReplayOpen] = useState(true);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(0);

  // Calculate realistic score metrics without falsy || fallbacks
  const scores = history.map(item => typeof item.feedback?.score === 'number' ? item.feedback.score : 0);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const techScores = history.map(item => item.feedback?.breakdown?.technicalAccuracy ?? (typeof item.feedback?.score === 'number' ? item.feedback.score : 0));
  const commScores = history.map(item => item.feedback?.breakdown?.communication ?? (typeof item.feedback?.score === 'number' ? item.feedback.score : 0));
  const probScores = history.map(item => item.feedback?.breakdown?.problemSolving ?? (typeof item.feedback?.score === 'number' ? item.feedback.score : 0));
  const confScores = history.map(item => item.feedback?.breakdown?.confidence ?? (typeof item.feedback?.score === 'number' ? item.feedback.score : 0));

  const techScore = history.length > 0 ? Math.round(techScores.reduce((a, b) => a + b, 0) / history.length) : 0;
  const commScore = history.length > 0 ? Math.round(commScores.reduce((a, b) => a + b, 0) / history.length) : 0;
  const probScore = history.length > 0 ? Math.round(probScores.reduce((a, b) => a + b, 0) / history.length) : 0;
  const confidenceScore = history.length > 0 ? Math.round(confScores.reduce((a, b) => a + b, 0) / history.length) : 0;

  let hiringRec = "Strong Hire";
  let recBadge = "bg-green-600/20 text-green-400 border-green-500/30";
  if (avgScore < 30) {
    hiringRec = "Not Ready (Invalid / Unresponsive)";
    recBadge = "bg-red-500/20 text-red-400 border-red-500/30";
  } else if (avgScore < 65) {
    hiringRec = "Needs Practice";
    recBadge = "bg-amber-500/20 text-amber-400 border-amber-500/30";
  } else if (avgScore < 85) {
    hiringRec = "Recommend Next Technical Round";
    recBadge = "bg-blue-600/20 text-blue-400 border-blue-500/30";
  }

  const recommendations = generateLearningRecommendations(setupData.targetRole, history);

  const handleNavigateToRoadmap = () => {
    const recommendedSkillsStr = recommendations.map(r => r.skillName).join(', ');
    navigate('/app/roadmap', {
      state: {
        prefilledRole: setupData.targetRole,
        prefilledSkills: recommendedSkillsStr
      }
    });
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      
      {/* Left-Aligned Standardized Report Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#30363D]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400 mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>AI Mock Interview Evaluation Report</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interview Performance Report
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Completed session for <strong className="text-white">{setupData?.targetRole}</strong> ({history.length} Questions evaluated).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#161B22] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Export PDF
          </button>
          <button
            onClick={onRestart}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> New Session
          </button>
        </div>
      </div>

      {/* Top Overview Metric Card */}
      <div className="bg-[#161B22] border-2 border-blue-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#30363D]">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Candidate Evaluation Result</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">{candidateName}</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">Hiring Status</span>
              <span className={`px-3 py-1 rounded-full border text-xs font-extrabold ${recBadge}`}>
                {hiringRec}
              </span>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex flex-col items-center justify-center text-blue-400 font-extrabold">
              <span className="text-xl leading-none">{avgScore}%</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 mt-0.5">Overall</span>
            </div>
          </div>
        </div>

        {/* 4 Score Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Technical Accuracy</span>
            <div className={`text-lg font-extrabold ${techScore < 30 ? 'text-red-400' : 'text-blue-400'}`}>{techScore}%</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Communication</span>
            <div className={`text-lg font-extrabold ${commScore < 30 ? 'text-red-400' : 'text-green-400'}`}>{commScore}%</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Problem Solving</span>
            <div className={`text-lg font-extrabold ${probScore < 30 ? 'text-red-400' : 'text-amber-400'}`}>{probScore}%</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Confidence & Clarity</span>
            <div className={`text-lg font-extrabold ${confidenceScore < 30 ? 'text-red-400' : 'text-purple-400'}`}>{confidenceScore}%</div>
          </div>
        </div>
      </div>

      {/* Comprehensive Career Readiness Summary */}
      <div className="bg-[#161B22] border-2 border-emerald-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              🎓 Final Career Readiness Assessment
            </span>
            <h3 className="text-lg font-extrabold text-white mt-1">Career Pilot Summary</h3>
          </div>
        </div>

        {/* 4 Score Metrics Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Resume Score</span>
            <div className="text-lg font-extrabold text-green-400">{computedStats.resumeScore}%</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Job Match</span>
            <div className="text-lg font-extrabold text-blue-400">{computedStats.jobMatchScore}%</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Roadmap Progress</span>
            <div className="text-lg font-extrabold text-purple-400">{computedStats.roadmapProgress}%</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Interview Score</span>
            <div className={`text-lg font-extrabold ${avgScore < 30 ? 'text-red-400' : 'text-amber-400'}`}>{avgScore}%</div>
          </div>
        </div>
      </div>

      {/* Target Skill Recommendations & Bridge to Skill Gap Roadmap */}
      {recommendations.length > 0 && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#30363D]">
            <div>
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-bold text-white">Recommended Focus Areas</h3>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Targeted skills to study based on your answer feedback during this interview session.
              </p>
            </div>

            <button
              onClick={handleNavigateToRoadmap}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
            >
              <span>Generate Roadmap for These Skills</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> {rec.skillName}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
                    Priority: High
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-medium">
                  {rec.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Question-by-Question Transcript Replay */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div 
          onClick={() => setReplayOpen(!replayOpen)}
          className="flex items-center justify-between cursor-pointer pb-4 border-b border-[#30363D]"
        >
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-bold text-white">Question-by-Question Transcript & Evaluation Evidence</h3>
          </div>
          <button type="button" className="text-gray-400 hover:text-white">
            {replayOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {replayOpen && (
          <div className="space-y-4 pt-2">
            {history.map((item, idx) => {
              const isExpanded = expandedQuestionIndex === idx;
              const itemScore = typeof item.feedback?.score === 'number' ? item.feedback.score : 0;
              const status = item.feedback?.status || (itemScore === 0 ? 'INVALID' : 'VALID');

              let statusBadge = { label: 'VALID', style: 'bg-green-500/10 text-green-400 border-green-500/30' };
              if (status === 'INVALID' || status === 'NO_RESPONSE') {
                statusBadge = { label: 'INVALID RESPONSE', style: 'bg-red-500/10 text-red-400 border-red-500/30' };
              } else if (status === 'IRRELEVANT') {
                statusBadge = { label: 'OFF TOPIC', style: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
              } else if (status === 'PARTIAL') {
                statusBadge = { label: 'PARTIAL RESPONSE', style: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
              }

              return (
                <div 
                  key={idx}
                  className="rounded-xl bg-[#0D1117] border border-[#30363D] overflow-hidden transition-colors"
                >
                  <div 
                    onClick={() => setExpandedQuestionIndex(isExpanded ? null : idx)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#161B22] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
                        Q{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-white line-clamp-1">
                        {item.question?.questionText || item.question?.question || (typeof item.question === 'string' ? item.question : 'Interview Question')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${statusBadge.style}`}>
                        {statusBadge.label}
                      </span>
                      <span className={`text-xs font-mono font-bold ${itemScore < 30 ? 'text-red-400' : 'text-blue-400'}`}>
                        Score: {itemScore}%
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-5 border-t border-[#30363D] space-y-4 bg-[#161B22]/50 text-xs">
                      
                      {/* Candidate's Answer */}
                      <div className="space-y-1">
                        <span className="font-bold text-gray-400 uppercase tracking-wider block text-[10px]">Your Response:</span>
                        <p className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-gray-200 leading-relaxed font-medium font-mono">
                          "{item.answer}"
                        </p>
                      </div>

                      {/* AI Feedback Analysis */}
                      {item.feedback && (
                        (status === 'INVALID' || status === 'NO_RESPONSE') ? (
                          /* Invalid/Nonsense Warning Card */
                          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-2">
                            <div className="flex items-center justify-between text-red-400 font-bold">
                              <span className="flex items-center gap-1.5 text-xs">
                                <AlertTriangle className="w-4 h-4" /> Answer Evaluation Failed (Invalid Response)
                              </span>
                              <span className="text-[10px] font-mono uppercase bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
                                Score: 0%
                              </span>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-xs">
                              {item.feedback.feedback || "No meaningful answer was provided. This question could not be evaluated because the submitted response appears to be random text or does not answer the question."}
                            </p>
                            {item.feedback.reason && (
                              <p className="text-[11px] text-red-400 font-mono">
                                Reason: {item.feedback.reason}
                              </p>
                            )}
                            {item.feedback.evidence && item.feedback.evidence.length > 0 && (
                              <div className="pt-2 border-t border-red-500/20 text-[11px] text-red-300 space-y-1">
                                <span className="font-bold uppercase tracking-wider text-[10px] text-red-400">Evaluation Evidence:</span>
                                <ul className="list-disc list-inside space-y-0.5">
                                  {item.feedback.evidence.map((ev, i) => (
                                    <li key={i}>{ev}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Valid / Partial / Irrelevant Detailed Feedback Card */
                          <div className="space-y-3">
                            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                              <span className="font-bold text-gray-400 uppercase tracking-wider block text-[10px]">Interviewer Feedback:</span>
                              <p className="text-gray-300 leading-relaxed font-medium">
                                {item.feedback.feedback}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 space-y-1">
                                <span className="font-bold text-green-400 uppercase tracking-wider block text-[10px]">What Went Well</span>
                                <ul className="list-disc list-inside text-gray-300 leading-relaxed font-medium space-y-0.5">
                                  {(Array.isArray(item.feedback.strengths) ? item.feedback.strengths : [item.feedback.strengths]).map((s, i) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                                <span className="font-bold text-amber-400 uppercase tracking-wider block text-[10px]">Area for Improvement</span>
                                <ul className="list-disc list-inside text-gray-300 leading-relaxed font-medium space-y-0.5">
                                  {(Array.isArray(item.feedback.improvements) ? item.feedback.improvements : [item.feedback.improvements]).map((imp, i) => (
                                    <li key={i}>{imp}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {item.feedback.evidence && item.feedback.evidence.length > 0 && (
                              <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] text-[11px] text-blue-300 space-y-1">
                                <span className="font-bold uppercase tracking-wider text-[10px] text-blue-400">Technical Evaluation Evidence:</span>
                                <ul className="list-disc list-inside space-y-0.5">
                                  {item.feedback.evidence.map((ev, i) => (
                                    <li key={i}>{ev}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
