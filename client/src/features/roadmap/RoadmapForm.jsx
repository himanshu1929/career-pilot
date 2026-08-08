import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Map, Sparkles, ArrowRight, Loader2, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageContainer';

export const RoadmapForm = ({ 
  onGenerateRoadmap, 
  onGenerate, 
  generating, 
  roadmapSeed, 
  isFromJobMatcher, 
  onClearImportedSeed 
}) => {
  const location = useLocation();
  const handleGenerate = onGenerateRoadmap || onGenerate;

  const [targetRole, setTargetRole] = useState(() => {
    if (isFromJobMatcher && roadmapSeed?.targetRole) return roadmapSeed.targetRole;
    return location.state?.prefilledRole || '';
  });

  const [currentSkills, setCurrentSkills] = useState(() => {
    if (isFromJobMatcher && Array.isArray(roadmapSeed?.currentSkills)) return roadmapSeed.currentSkills.join(', ');
    return location.state?.prefilledSkills || '';
  });

  const [missingSkills, setMissingSkills] = useState(() => {
    if (isFromJobMatcher && Array.isArray(roadmapSeed?.missingSkills)) return roadmapSeed.missingSkills;
    return [];
  });

  const [experienceLevel, setExperienceLevel] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (isFromJobMatcher && roadmapSeed) {
      if (roadmapSeed.targetRole) setTargetRole(roadmapSeed.targetRole);
      if (Array.isArray(roadmapSeed.currentSkills)) setCurrentSkills(roadmapSeed.currentSkills.join(', '));
      if (Array.isArray(roadmapSeed.missingSkills)) setMissingSkills(roadmapSeed.missingSkills);
    } else if (location.state?.prefilledRole) {
      setTargetRole(location.state.prefilledRole);
    }
  }, [isFromJobMatcher, roadmapSeed, location.state]);

  const samplePresets = [
    {
      role: 'Frontend Developer',
      skills: 'React, JavaScript, HTML, CSS, Git',
      level: 'Junior (0-2 YOE)'
    },
    {
      role: 'Backend Developer',
      skills: 'Node.js, Express, MongoDB, REST APIs, SQL',
      level: 'Junior (0-2 YOE)'
    },
    {
      role: 'Full Stack Engineer',
      skills: 'React, Node.js, TypeScript, PostgreSQL, Docker',
      level: 'Junior (0-2 YOE)'
    },
    {
      role: 'GATE CSE / CS Fundamentals',
      skills: 'C Language, Data Structures, Algorithms, OS, DBMS',
      level: 'Student / Intern'
    }
  ];

  const handleApplyPreset = (preset) => {
    setTargetRole(preset.role);
    setCurrentSkills(preset.skills);
    setExperienceLevel(preset.level);
    setMissingSkills([]);
  };

  const handleRemoveMissingSkill = (indexToRemove) => {
    setMissingSkills((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const isTargetRoleValid = Boolean(targetRole && targetRole.trim().length >= 2);
  const isCurrentSkillsValid = Boolean(currentSkills && currentSkills.trim().length >= 2);
  const isExperienceValid = Boolean(experienceLevel && experienceLevel.trim().length > 0);
  const isFormValid = isTargetRoleValid && isCurrentSkillsValid && isExperienceValid;

  const showTargetRoleError = !isTargetRoleValid && hasSubmitted;
  const showCurrentSkillsError = !isCurrentSkillsValid && hasSubmitted;
  const showExperienceError = !isExperienceValid && hasSubmitted;

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!isFormValid) return;

    if (handleGenerate) {
      handleGenerate({
        targetRole: targetRole.trim(),
        currentSkills: currentSkills.trim(),
        missingSkills,
        experienceLevel
      });
    }
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      
      {/* Standardized Page Header */}
      <PageHeader
        title="Learning Roadmap"
        subtitle="Generate a personalized roadmap based on your skill gaps."
        backTo="/app/dashboard"
        backLabel="Back to Dashboard"
      />

      {/* Success Banner when navigating from Job Matcher */}
      {isFromJobMatcher && roadmapSeed && (
        <div className="bg-gradient-to-r from-blue-950/60 via-purple-950/40 to-[#161B22] border-2 border-blue-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl flex items-start justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                  Job Match Analysis Imported
                </span>
              </div>
              <h4 className="text-base font-bold text-white">Target Role & Skill Gaps Loaded</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                We've automatically imported your target role (<strong className="text-blue-400 font-semibold">{roadmapSeed.targetRole}</strong>) and identified the skills you're missing. Select your experience level to generate a personalized learning roadmap focused on closing your skill gap.
              </p>
            </div>
          </div>
          {onClearImportedSeed && (
            <button
              type="button"
              onClick={onClearImportedSeed}
              className="text-gray-400 hover:text-white text-xs font-semibold p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex-shrink-0"
              title="Dismiss imported analysis"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Interview Pre-fill Banner (Fallback if from mock interview) */}
      {!isFromJobMatcher && location.state?.prefilledRole && (
        <div className="bg-[#161B22] border border-purple-500/30 rounded-xl p-4 flex items-center gap-3 shadow-md">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs text-gray-300">
            <strong className="text-white font-semibold">Interview Recommendations Applied:</strong> Pre-filled target role (<span className="text-purple-400">{targetRole}</span>) and recommended skills.
          </div>
        </div>
      )}

      {/* Main Roadmap Setup Form */}
      <form onSubmit={handleSubmit} className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        
        <div className="space-y-4">
          
          {/* Target Role Input */}
          <div className="space-y-2">
            <label htmlFor="target-role-input" className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              1. Target Career Role <span className="text-rose-400 font-bold">*</span>
            </label>
            <input
              id="target-role-input"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Example: Frontend Developer"
              className={`w-full px-4 py-3 rounded-xl bg-[#0D1117] border text-white text-sm focus:outline-none transition-colors ${
                showTargetRoleError ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#30363D] focus:border-purple-500'
              }`}
            />
            {showTargetRoleError && (
              <p className="text-xs text-rose-400 font-medium pt-0.5">Target Career Role is required.</p>
            )}
          </div>

          {/* Current Skills Input */}
          <div className="space-y-2">
            <label htmlFor="current-skills-input" className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              2. Your Current Skills & Knowledge <span className="text-rose-400 font-bold">*</span>
            </label>
            <textarea
              id="current-skills-input"
              rows={3}
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              placeholder="Example: React, JavaScript, HTML, CSS..."
              className={`w-full px-4 py-3 rounded-xl bg-[#0D1117] border text-white text-sm focus:outline-none transition-colors leading-relaxed ${
                showCurrentSkillsError ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#30363D] focus:border-purple-500'
              }`}
            />
            {showCurrentSkillsError && (
              <p className="text-xs text-rose-400 font-medium pt-0.5">Current Skills are required.</p>
            )}
          </div>

          {/* Dedicated Section: Skills Missing For Target Job */}
          {missingSkills.length > 0 && (
            <div className="space-y-3 bg-[#0D1117] border border-rose-500/30 rounded-xl p-4 sm:p-5 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <label className="text-xs font-bold text-rose-300 uppercase tracking-wider block">
                    Skills Missing For Target Job ({missingSkills.length})
                  </label>
                </div>
                <span className="text-[10px] text-gray-400">Click X to remove any skill</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMissingSkill(idx)}
                      className="hover:text-white hover:bg-rose-500/30 p-0.5 rounded-full transition-colors cursor-pointer"
                      title={`Remove ${skill}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience Level Selector */}
          <div className="space-y-2">
            <label htmlFor="experience-level-select" className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              3. Current Experience Level <span className="text-rose-400 font-bold">*</span>
            </label>
            <select
              id="experience-level-select"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-[#0D1117] border text-white text-sm focus:outline-none transition-colors cursor-pointer ${
                showExperienceError ? 'border-rose-500/80 focus:border-rose-500' : 'border-[#30363D] focus:border-purple-500'
              }`}
            >
              <option value="" disabled>Select Experience Level</option>
              <option value="Student / Intern">Student / Intern / Career Switcher</option>
              <option value="Entry-Level (0-2 YOE)">Entry-Level (0-2 Years Experience)</option>
              <option value="Junior Level">Junior Level (1-2 Years Experience)</option>
              <option value="Mid-Level (2-4 YOE)">Mid-Level (2-4 Years Experience)</option>
              <option value="Senior Level (5+ YOE)">Senior Level (5+ Years Experience)</option>
            </select>
            {showExperienceError && (
              <p className="text-xs text-rose-400 font-medium pt-0.5">Please select your experience level.</p>
            )}
          </div>

        </div>

        {/* Popular Presets */}
        {!isFromJobMatcher && (
          <div className="space-y-2 pt-2 border-t border-[#30363D]">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Or Click a Sample Role Preset:
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-1.5 rounded-lg bg-[#0D1117] hover:bg-[#21262d] border border-[#30363D] text-gray-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  {preset.role}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit Action Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={generating || !targetRole.trim()}
            className={`w-full py-4 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              generating || !targetRole.trim()
                ? 'bg-purple-600/50 text-gray-300 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Generating AI Skill Gap Roadmap...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Generate Skill Gap Roadmap</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
