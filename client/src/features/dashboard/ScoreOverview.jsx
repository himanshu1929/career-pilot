import React from 'react';
import { FileText, Target, Map, Award, TrendingUp, ArrowRight, Mic } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const ScoreOverview = ({ onNavigate }) => {
  const { computedStats } = useWorkspace();
  const { 
    resumeCount = 0, 
    latestAtsScore = 0, 
    jobMatchScore = 0, 
    totalJobMatches = 0,
    recentJobCompany = null,
    roadmapPercent = 0, 
    activeRoadmapTitle = '', 
    interviewScore = 0,
    interviewCount = 0,
    overallCareerScore = 0 
  } = computedStats || {};

  const safeAtsScore = Number(latestAtsScore || 0);
  const safeJobMatchScore = Number(jobMatchScore || 0);
  const safeRoadmapPercent = Number(roadmapPercent || 0);
  const safeInterviewScore = Number(interviewScore || 0);
  const safeOverallCareerScore = Number(overallCareerScore || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 my-6">
      
      {/* Card 1: Resumes (Highlighted Primary Entry) */}
      <div 
        onClick={() => onNavigate('resume')}
        className="group bg-[#161B22] hover:bg-[#1c2128] rounded-xl p-5 border border-blue-500/50 hover:border-blue-400 flex flex-col justify-between space-y-4 transition-all cursor-pointer hover:-translate-y-1 shadow-sm shadow-blue-500/10 hover:shadow-md h-full relative overflow-hidden"
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
              Resumes
            </span>
            {resumeCount > 0 ? (
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {safeAtsScore}<span className="text-sm text-gray-400 font-normal">%</span>
              </h3>
            ) : (
              <h3 className="text-xl font-bold text-gray-400 mt-1">
                Not Started
              </h3>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-600/10 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div>
          {resumeCount > 0 ? (
            <div className="space-y-2">
              <div className="text-xs text-gray-400 flex items-center justify-between">
                <span>Scanned: <strong className="text-white font-bold">{resumeCount}</strong></span>
                <span className="text-green-400 font-bold">Completed</span>
              </div>
              <div className="w-full bg-[#0D1117] h-1.5 rounded-full overflow-hidden border border-[#30363D]">
                <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, safeAtsScore))}%` }} />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 leading-snug">Upload your resume to unlock ATS insights.</p>
              <div className="text-xs font-semibold text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
                <span>Upload Resume</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card 2: Job Matcher */}
      <div 
        onClick={() => onNavigate('job-match')}
        className="group bg-[#161B22] hover:bg-[#1c2128] rounded-xl p-5 border border-[#30363D] hover:border-blue-500/50 flex flex-col justify-between space-y-4 transition-all cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-md h-full"
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              Job Matcher
            </span>
            {totalJobMatches > 0 ? (
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {safeJobMatchScore}<span className="text-sm text-gray-400 font-normal">%</span>
              </h3>
            ) : (
              <h3 className="text-xl font-bold text-gray-400 mt-1">
                Not Started
              </h3>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div>
          {totalJobMatches > 0 ? (
            <div className="space-y-2">
              <div className="text-xs text-gray-400 flex items-center justify-between">
                <span>Matches: <strong className="text-white font-bold">{totalJobMatches}</strong></span>
                <span className="text-blue-400 font-bold truncate max-w-[100px]" title={recentJobCompany || 'Completed'}>
                  Completed
                </span>
              </div>
              <div className="w-full bg-[#0D1117] h-1.5 rounded-full overflow-hidden border border-[#30363D]">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, safeJobMatchScore))}%` }} />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 leading-snug">Compare your resume against a target job description.</p>
              <div className="text-xs font-medium text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
                <span>Compare Resume</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Card 3: Learning Roadmap */}
      <div 
        onClick={() => onNavigate('roadmap')}
        className="group bg-[#161B22] hover:bg-[#1c2128] rounded-xl p-5 border border-[#30363D] hover:border-purple-500/50 flex flex-col justify-between space-y-4 transition-all cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-md h-full"
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              Learning Roadmap
            </span>
            {activeRoadmapTitle ? (
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {safeRoadmapPercent}<span className="text-sm text-gray-400 font-normal">%</span>
              </h3>
            ) : (
              <h3 className="text-xl font-bold text-gray-400 mt-1">
                Not Started
              </h3>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
            <Map className="w-5 h-5" />
          </div>
        </div>

        <div>
          {activeRoadmapTitle ? (
            <div className="space-y-2">
              <div className="text-xs text-gray-400 flex items-center justify-between truncate">
                <span className="truncate">{activeRoadmapTitle}</span>
                <span className="text-purple-400 font-bold flex-shrink-0">Completed</span>
              </div>
              <div className="w-full bg-[#0D1117] h-1.5 rounded-full overflow-hidden border border-[#30363D]">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, safeRoadmapPercent))}%` }} />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 leading-snug">Generate your personalized step-by-step learning roadmap.</p>
              <div className="text-xs font-medium text-purple-400 group-hover:text-purple-300 flex items-center gap-1">
                <span>Generate Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}
        </div>
      </div>
        {/* Card 4: Mock Interview */}
        <div 
        onClick={() => onNavigate('interview')}
        className="group bg-[#161B22] hover:bg-[#1c2128] rounded-xl p-5 border border-[#30363D] hover:border-amber-500/50 flex flex-col justify-between space-y-4 transition-all cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-md h-full"
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              Mock Interview
            </span>
            {interviewCount > 0 ? (
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {safeInterviewScore}<span className="text-sm text-gray-400 font-normal">%</span>
              </h3>
            ) : (
              <h3 className="text-xl font-bold text-gray-400 mt-1">
                Not Started
              </h3>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5" />
          </div>
        </div>

        <div>
          {interviewCount > 0 ? (
            <div className="space-y-2">
              <div className="text-xs text-gray-400 flex items-center justify-between">
                <span>Interviews Taken: <strong className="text-white font-bold">{interviewCount}</strong></span>
                <span className="text-amber-400 font-bold">Completed</span>
              </div>
              <div className="w-full bg-[#0D1117] h-1.5 rounded-full overflow-hidden border border-[#30363D]">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, safeInterviewScore))}%` }} />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 leading-snug">Practice interactive AI technical & behavioral questions.</p>
              <div className="text-xs font-medium text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
                <span>Practice Interview</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card 5: Career Score (Derived & Unlocked after Resume Scan) */}
      <div className="bg-[#161B22] rounded-xl p-5 border border-[#30363D] flex flex-col justify-between space-y-4 h-full">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              Career Score
            </span>
            {resumeCount > 0 && safeOverallCareerScore > 0 ? (
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {safeOverallCareerScore}<span className="text-sm text-gray-400 font-normal">/100</span>
              </h3>
            ) : (
              <h3 className="text-xl font-bold text-gray-500 mt-1">
                Locked
              </h3>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div>
          {resumeCount > 0 && safeOverallCareerScore > 0 ? (
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                <TrendingUp className="w-3 h-3" />
                Live Workspace Derived
              </span>
              <div className="w-full bg-[#0D1117] h-1.5 rounded-full overflow-hidden border border-[#30363D]">
                <div className="bg-gradient-to-r from-blue-500 to-green-400 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, safeOverallCareerScore))}%` }} />
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 leading-snug">
              Complete your first resume analysis to unlock your Career Score.
            </p>
          )}
        </div>
      </div>

    </div>
  );
};
