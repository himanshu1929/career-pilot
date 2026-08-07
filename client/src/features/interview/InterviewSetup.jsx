import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  Mic, 
  Sparkles, 
  ArrowRight, 
  Check, 
  ChevronDown,
  UserCheck, 
  History, 
  Trash2, 
  Eye, 
  Calendar 
} from 'lucide-react';

import sarahAvatar from '../../assets/interviewers/sarah.jpg';
import alexAvatar from '../../assets/interviewers/alex.jpg';
import davidAvatar from '../../assets/interviewers/david.jpg';
import elenaAvatar from '../../assets/interviewers/elena.jpg';

const PERSONA_CONFIGS = [
  {
    id: 'friendly',
    avatarImg: sarahAvatar,
    name: 'Sarah',
    title: 'Senior Frontend Engineer',
    highlights: ['✓ Friendly', '✓ Gives hints', '✓ Beginner friendly'],
    badge: 'Recommended for first interview'
  },
  {
    id: 'startup',
    avatarImg: alexAvatar,
    name: 'Alex',
    title: 'Startup Lead Engineer',
    highlights: ['• Practical', '• Fast-paced', '• Product mindset']
  },
  {
    id: 'bigtech',
    avatarImg: davidAvatar,
    name: 'David',
    title: 'Big Tech Staff Engineer',
    highlights: ['• FAANG style', '• Deep technical', '• High difficulty']
  },
  {
    id: 'coach',
    avatarImg: elenaAvatar,
    name: 'Elena',
    title: 'Technical Coach',
    highlights: ['• Explains mistakes', '• Gives detailed feedback']
  }
];

// Modern Editable Role Combobox Component (VS Code / Notion / Figma style)
const EditableRoleCombobox = ({ popularRoles, selectedRole, customRole, onSelectRole, onSaveCustomRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempCustomText, setTempCustomText] = useState(customRole || '');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus input when editing mode is triggered
  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isEditing]);

  const handleSelectPredefined = (role) => {
    onSelectRole(role);
    setIsOpen(false);
    setIsEditing(false);
  };

  const handleStartCustomEditing = () => {
    setIsEditing(true);
    setTempCustomText(customRole || '');
  };

  const handleSelectExistingCustom = () => {
    onSelectRole('custom');
    setIsOpen(false);
    setIsEditing(false);
  };

  const normalize = (str) => {
    return (str || '').trim().toLowerCase().replace(/\s+/g, ' ');
  };

  const handleSaveCustom = () => {
    const trimmedInput = tempCustomText.trim().replace(/\s+/g, ' ');
    if (!trimmedInput) {
      setIsEditing(false);
      setIsOpen(false);
      return;
    }

    const normalizedInput = normalize(trimmedInput);

    // Validate against all existing predefined roles (case-insensitive, whitespace collapsed)
    const existingMatch = popularRoles.find((role) => normalize(role) === normalizedInput);

    if (existingMatch) {
      // Automatically select existing predefined role to prevent duplicate custom entry
      onSelectRole(existingMatch);
      onSaveCustomRole('');
    } else {
      // Save valid unique custom role
      onSaveCustomRole(trimmedInput);
      onSelectRole('custom');
    }

    setIsEditing(false);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveCustom();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setIsOpen(false);
    }
  };

  // Determine label displayed on the trigger button
  const activeDisplayLabel = selectedRole === 'custom'
    ? (customRole ? `${customRole} (Custom)` : 'Custom Role...')
    : selectedRole;

  return (
    <div className="relative w-full" ref={containerRef}>
      
      {/* Combobox Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-3 rounded-xl bg-[#0D1117] border border-[#30363D] text-white text-xs font-semibold flex items-center justify-between hover:border-blue-500 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
      >
        <span className="truncate">{activeDisplayLabel}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Menu Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#0D1117] border border-[#30363D] rounded-xl shadow-2xl p-1.5 z-50 animate-fadeIn space-y-1">
          
          {/* Predefined Roles List */}
          <div className="max-h-56 overflow-y-auto space-y-1 custom-scrollbar">
            {popularRoles.map((role) => {
              const isSelected = selectedRole === role;
              return (
                <div
                  key={role}
                  onClick={() => handleSelectPredefined(role)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-gray-300 hover:bg-[#161B22] hover:text-white'
                  }`}
                >
                  <span>{role}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#30363D] my-1" />

          {/* Inline Editable Custom Role Option */}
          {isEditing ? (
            <div className="p-1 flex items-center gap-2">
              <span className="text-xs">✏️</span>
              <input
                ref={inputRef}
                type="text"
                value={tempCustomText}
                onChange={(e) => setTempCustomText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type custom role & press Enter..."
                className="w-full px-3 py-1.5 rounded-lg bg-[#161B22] border border-blue-500 text-white text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-lg cursor-pointer"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {customRole && (
                <div
                  onClick={handleSelectExistingCustom}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-between transition-colors ${
                    selectedRole === 'custom'
                      ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300 font-bold'
                      : 'text-gray-300 hover:bg-[#161B22] hover:text-white'
                  }`}
                >
                  <span>✓ {customRole} <span className="text-[10px] text-blue-400 font-mono">(Custom)</span></span>
                  {selectedRole === 'custom' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </div>
              )}

              <div
                onClick={handleStartCustomEditing}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-blue-400 hover:bg-[#161B22] hover:text-blue-300 cursor-pointer flex items-center gap-2 transition-colors"
              >
                <span>✏️</span>
                <span>{customRole ? 'Edit Custom Role...' : 'Custom Role...'}</span>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export const InterviewSetup = ({ onStart, onStartInterview, onViewSavedReport, loading }) => {
  const navigate = useNavigate();
  const handleStart = onStart || onStartInterview;
  const { profile, resumeHistory, interviews, deleteInterview, clearInterviewHistory } = useWorkspace();

  const popularRoles = [
    'Frontend Developer',
    'Backend Engineer (Java/Spring)',
    'Full Stack Engineer',
    'AI / Machine Learning Engineer',
    'DevOps / Cloud Engineer',
    'Mobile App Developer'
  ];

  const initialSelected = profile?.goal 
    ? (popularRoles.includes(profile.goal) ? profile.goal : 'custom')
    : 'Frontend Developer';

  const initialCustom = profile?.goal && !popularRoles.includes(profile.goal)
    ? profile.goal
    : '';

  const [selectedRole, setSelectedRole] = useState(initialSelected);
  const [customRole, setCustomRole] = useState(initialCustom);
  const [experienceLevel, setExperienceLevel] = useState(profile?.experience || 'Working Professional');
  const [interviewType, setInterviewType] = useState('Mixed');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount] = useState(10);
  const [selectedPersona, setSelectedPersona] = useState('friendly');

  // Extract detected resume skills if available
  const detectedSkills = (resumeHistory[0]?.missingSkills || [])
    .map(s => typeof s === 'string' ? s : s.name)
    .concat((resumeHistory[0]?.strengths || []).map(s => typeof s === 'string' ? s : s.title))
    .filter(Boolean);

  const displaySkills = detectedSkills.length > 0
    ? Array.from(new Set(detectedSkills)).slice(0, 5)
    : ['TypeScript', 'React', 'REST APIs', 'Git', 'SQL'];

  const activePersonaObj = PERSONA_CONFIGS.find(p => p.id === selectedPersona) || PERSONA_CONFIGS[0];

  const activeRole = selectedRole === 'custom'
    ? (customRole.trim() || 'Software Engineer')
    : selectedRole;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleStart) {
      handleStart({
        targetRole: activeRole,
        experienceLevel,
        interviewType,
        difficulty,
        questionCount,
        personaId: selectedPersona,
        resumeSkills: displaySkills
      });
    }
  };

  return (
    <div className="w-full space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#30363D]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 mb-2">
            <Mic className="w-3.5 h-3.5" />
            <span>AI Mock Interview Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Mock Interview Workspace
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Simulate realistic domain-specific technical & behavioral interviews with instant AI evaluation.
          </p>
        </div>
      </div>

      {/* 1. Resume Context Banner */}
      {resumeHistory.length > 0 ? (
        <div className="bg-[#161B22] border border-blue-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] pb-3">
            <div className="flex items-center gap-2 text-blue-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Resume Personalization Active
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/app/resume-analyzer')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>Change Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-gray-300">
              Questions will be generated using key skills extracted from your resume:
            </p>
            
            <div className="flex flex-wrap gap-1.5">
              {displaySkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="text-[11px] font-mono text-gray-400 pt-1">
              Resume: <strong className="text-gray-200">{resumeHistory[0]?.filename || 'Uploaded_Resume.pdf'}</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#161B22] border border-blue-500/20 rounded-2xl p-5 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Personalization Available</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/app/resume-analyzer')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Upload Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Upload your resume to automatically tailor AI interview questions to your background.
          </p>
        </div>
      )}

      {/* Main Setup Form */}
      <form onSubmit={handleSubmit} className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 space-y-10 shadow-xl">
        
        {/* 2. Choose AI Interviewer */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
            Choose Your AI Interviewer
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {PERSONA_CONFIGS.map((p) => {
              const selected = selectedPersona === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPersona(p.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between h-full space-y-3 ${
                    selected
                      ? 'bg-blue-600/10 border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
                      : 'bg-[#0D1117] border-[#30363D] hover:border-gray-500'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                        selected ? 'border-blue-500 shadow-lg shadow-blue-500/40 ring-2 ring-blue-500/30 scale-105' : 'border-[#30363D]'
                      }`}>
                        <img
                          src={p.avatarImg}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {selected && <Check className="w-4 h-4 text-blue-400" />}
                    </div>

                    <h4 className="text-sm font-extrabold text-white">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-mono block mb-3">
                      {p.title}
                    </p>

                    <div className="space-y-1 text-xs text-gray-300 font-medium">
                      {p.highlights.map((h, i) => (
                        <div key={i} className="leading-tight">{h}</div>
                      ))}
                    </div>
                  </div>

                  {p.badge && (
                    <div className="pt-2 border-t border-[#30363D]/60">
                      <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full block text-center">
                        {p.badge}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Combined Role + Experience Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Target Role Combobox */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              Target Role
            </label>
            <EditableRoleCombobox
              popularRoles={popularRoles}
              selectedRole={selectedRole}
              customRole={customRole}
              onSelectRole={(role) => setSelectedRole(role)}
              onSaveCustomRole={(typedText) => setCustomRole(typedText)}
            />
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0D1117] border border-[#30363D] text-white text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="Intern / Student">Intern / Student / Entry Level</option>
              <option value="Working Professional">Working Professional (1-3 YOE)</option>
              <option value="Senior Developer">Senior Engineer (4+ YOE)</option>
              <option value="Tech Lead / Staff">Tech Lead / Staff Engineer</option>
            </select>
          </div>

        </div>

        {/* 4. Evaluation Difficulty Segmented Control */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
            Evaluation Difficulty
          </label>
          <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-1 grid grid-cols-3 gap-1">
            {['Easy', 'Medium', 'Hard'].map((diff) => {
              const active = difficulty === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Interview Format & Scope Cards (90-100px height) */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
            Interview Format & Scope
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'Mixed', title: 'Mixed', badge: 'Recommended', desc: 'Technical domain + Behavioral STAR scenarios' },
              { id: 'Technical', title: 'Technical', desc: 'Coding, frameworks & system architecture' },
              { id: 'Behavioral', title: 'Behavioral', desc: 'Leadership, teamwork & STAR scenarios' }
            ].map((t) => {
              const selected = interviewType === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setInterviewType(t.id)}
                  className={`h-[95px] p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    selected
                      ? 'bg-blue-600/10 border-blue-500/60 ring-1 ring-blue-500/40 text-white'
                      : 'bg-[#0D1117] border-[#30363D] text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">
                      {t.title}
                    </h4>
                    {t.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold">
                        ⭐ {t.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 leading-tight">
                    {t.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Interview Pre-Flight Summary Card */}
        <div className="bg-[#0D1117] border border-[#30363D] rounded-2xl p-5 space-y-4 shadow-inner">
          <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-400" />
              Interview Summary
            </h3>
            <span className="text-[10px] text-blue-400 font-mono">Ready to Launch</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <span className="text-gray-500 text-[10px] block uppercase font-mono mb-0.5">Interviewer</span>
              <div className="flex items-center gap-1.5">
                <img src={activePersonaObj.avatarImg} alt={activePersonaObj.name} className="w-4 h-4 rounded-full object-cover" />
                <span className="text-white font-extrabold">{activePersonaObj.name}</span>
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block uppercase font-mono mb-0.5">💼 Role</span>
              <span className="text-white font-extrabold truncate block">{activeRole}</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block uppercase font-mono mb-0.5">📈 Level</span>
              <span className="text-white font-extrabold">{experienceLevel.split(' ')[0]}</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block uppercase font-mono mb-0.5">🎯 Difficulty</span>
              <span className="text-amber-400 font-extrabold">{difficulty}</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] block uppercase font-mono mb-0.5">🧠 Format</span>
              <span className="text-blue-400 font-extrabold">{interviewType}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-[#30363D]">
            <span>Estimated Duration: <strong className="text-white">25–30 min</strong></span>
            <span>Questions: <strong className="text-white">10–12 Questions</strong></span>
          </div>
        </div>

        {/* 7. Primary CTA Button & Muted Text */}
        <div className="pt-2 text-center space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Begin AI Mock Interview</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-gray-400">
            You'll receive detailed AI feedback after the interview.
          </p>
        </div>

      </form>

      {/* Recent Completed Interviews History */}
      {interviews.length > 0 && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Previous Interview History ({interviews.length})</h3>
            </div>
            <button
              onClick={clearInterviewHistory}
              className="text-[11px] text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Clear History
            </button>
          </div>

          <div className="space-y-2.5">
            {interviews.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-between gap-4 hover:border-gray-600 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.targetRole}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold">
                      Score: {item.score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(item.timestamp || Date.now()).toLocaleDateString()}
                    </span>
                    <span>Format: {item.interviewType || 'Mixed'}</span>
                    <span>Level: {item.difficulty || 'Medium'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewSavedReport(item)}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Report
                  </button>
                  <button
                    onClick={() => deleteInterview(item.id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
