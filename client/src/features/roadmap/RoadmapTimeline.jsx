import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageContainer';
import { 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Code, 
  Layers, 
  Sparkles, 
  ArrowLeft, 
  RefreshCw, 
  Clock, 
  Award, 
  ExternalLink,
  Target,
  TrendingUp,
  AlertCircle,
  XCircle,
  Wrench,
  Terminal,
  Cpu,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Compass,
  UserCheck,
  HelpCircle,
  Lightbulb,
  Briefcase,
  Zap,
  Flame,
  Star,
  Check,
  FileText,
  Map
} from 'lucide-react';

const ACHIEVEMENTS_STORAGE_KEY = 'career_pilot_unlocked_achievements';

// Minimal, Handcrafted ActionCard Component (Linear/Vercel/Stripe aesthetic)
const ActionCard = ({ icon: Icon, title, description, ctaText, accentColor = 'blue', onClick }) => {
  const colorMap = {
    blue: {
      iconBg: 'bg-blue-600/10 text-blue-400 border border-blue-500/20',
      border: 'border-[#30363D] hover:border-blue-500/50 focus:border-blue-500/50',
      ctaText: 'text-blue-400 group-hover:text-blue-300'
    },
    green: {
      iconBg: 'bg-green-600/10 text-green-400 border border-green-500/20',
      border: 'border-[#30363D] hover:border-green-500/50 focus:border-green-500/50',
      ctaText: 'text-green-400 group-hover:text-green-300'
    },
    amber: {
      iconBg: 'bg-amber-600/10 text-amber-400 border border-amber-500/20',
      border: 'border-[#30363D] hover:border-amber-500/50 focus:border-amber-500/50',
      ctaText: 'text-amber-400 group-hover:text-amber-300'
    },
    purple: {
      iconBg: 'bg-purple-600/10 text-purple-400 border border-purple-500/20',
      border: 'border-[#30363D] hover:border-purple-500/50 focus:border-purple-500/50',
      ctaText: 'text-purple-400 group-hover:text-purple-300'
    }
  };

  const colors = colorMap[accentColor] || colorMap.blue;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`group relative bg-[#161B22] hover:bg-[#1c2128] border ${colors.border} rounded-xl p-6 flex flex-col justify-between h-full space-y-5 transition-all duration-200 ease-out cursor-pointer hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
    >
      {/* Top: Colored Icon Container Only */}
      <div>
        <div className={`w-11 h-11 rounded-lg ${colors.iconBg} flex items-center justify-center font-bold transition-transform duration-200 group-hover:scale-105`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Middle: Title & 2-Line Description */}
      <div className="space-y-2 flex-1">
        <h4 className="text-[18px] font-semibold text-white tracking-tight group-hover:text-white transition-colors">
          {title}
        </h4>
        <p className="text-[14px] text-gray-400 leading-snug line-clamp-2">
          {description}
        </p>
      </div>

      {/* Bottom: Meaningful Action CTA & Arrow */}
      <div className={`pt-2 text-[15px] font-medium ${colors.ctaText} flex items-center gap-1.5 transition-colors`}>
        <span>{ctaText}</span>
        <ArrowRight className="w-4 h-4 text-current transition-transform duration-200 group-hover:translate-x-1" />
      </div>

    </div>
  );
};

// Achievement Badge Resolution Helper
const getAchievementBadge = (goalStr) => {
  const lower = (goalStr || '').toLowerCase();

  if (lower.includes('react') || lower.includes('frontend')) {
    return {
      title: 'Frontend Developer Ready',
      icon: '🏅',
      desc: 'Mastered modern ES6+, React 19, TypeScript, Next.js, and Vitest testing.'
    };
  }

  if (lower.includes('java') || lower.includes('spring')) {
    return {
      title: 'Java Backend Ready',
      icon: '🏅',
      desc: 'Mastered Java 17, Spring Boot 3, Spring Security, JPA, and microservices.'
    };
  }

  if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('python')) {
    return {
      title: 'AI Engineer Foundations',
      icon: '🏅',
      desc: 'Mastered Python 3, PyTorch neural networks, LangChain, RAG, and FastAPI.'
    };
  }

  if (lower.includes('devops') || lower.includes('cloud') || lower.includes('aws') || lower.includes('kubernetes')) {
    return {
      title: 'DevOps & Cloud Specialist',
      icon: '🏅',
      desc: 'Mastered containerization, CI/CD pipelines, Terraform, and cloud deployment.'
    };
  }

  if (lower.includes('android') || lower.includes('flutter') || lower.includes('ios')) {
    return {
      title: 'Mobile App Engineer Ready',
      icon: '🏅',
      desc: 'Mastered mobile application development, state management, and native APIs.'
    };
  }

  if (lower.includes('security') || lower.includes('cyber')) {
    return {
      title: 'Cybersecurity Specialist Ready',
      icon: '🏅',
      desc: 'Mastered network security, threat analysis, and secure code architecture.'
    };
  }

  return {
    title: `${goalStr} Certified Specialist`,
    icon: '🏅',
    desc: `Successfully completed all learning phases and capstone projects for ${goalStr}.`
  };
};

// Subtle Inline Canvas Confetti Particle Generator
const triggerSubtleCelebration = () => {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ['#2563EB', '#16A34A', '#D97706', '#3B82F6', '#10B981', '#F59E0B', '#60A5FA', '#E5E7EB'];
  const particles = Array.from({ length: 65 }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * (height * 0.3) - 40,
    vx: (Math.random() - 0.5) * 2.5,
    vy: Math.random() * 2.5 + 1.5,
    size: Math.random() * 6 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rSpeed: (Math.random() - 0.5) * 4,
    opacity: 1
  }));

  const startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    if (elapsed > 3000) {
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
      return;
    }

    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rSpeed;
      if (elapsed > 2000) {
        p.opacity = Math.max(0, 1 - (elapsed - 2000) / 1000);
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
};

export const RoadmapTimeline = ({ roadmapData, targetRole, onReset }) => {
  const navigate = useNavigate();
  const [expandedStepIndex, setExpandedStepIndex] = useState(0);
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [reviewMode, setReviewMode] = useState(false);

  const currentGoalStr = roadmapData?.targetRole || targetRole || 'Engineering Specialist';
  
  // Scoped Session Identifiers
  const roadmapId = roadmapData?.roadmapId || roadmapData?.id || `rm_${currentGoalStr.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${roadmapData?.createdAt || 'default'}`;

  const STORAGE_KEY = `career_pilot_roadmap_progress_${roadmapId}`;
  const CELEBRATED_KEY = `career_pilot_roadmap_celebrated_${roadmapId}`;

  const achievementBadge = getAchievementBadge(currentGoalStr);

  // Dynamic Fallback Helper
  const getDomainDefaults = (goalStr) => {
    const lower = (goalStr || '').toLowerCase();
    
    if (lower.includes('java') || lower.includes('spring')) {
      return {
        currentLevel: 'Entry-Level Java Developer',
        strong: [
          { name: 'Java 17', status: 'Strong', priority: 'Critical', explanation: 'Solid foundation in modern Java language constructs and object-oriented design.' },
          { name: 'REST API Design', status: 'Strong', priority: 'Critical', explanation: 'Understanding of HTTP verbs, status codes, and JSON payload serialization.' }
        ],
        needs: [
          { name: 'Spring Boot 3 Core', status: 'Needs Improvement', priority: 'Critical', explanation: 'Essential for building backend microservices with Inversion of Control.' },
          { name: 'Spring Data JPA', status: 'Needs Improvement', priority: 'Recommended', explanation: 'Simplifies database persistence and relational mapping.' }
        ],
        missing: [
          { name: 'Docker Containerization', status: 'Missing', priority: 'Critical', explanation: 'Frequently required for deployment and DevOps workflows.' },
          { name: 'Spring Security & JWT', status: 'Missing', priority: 'Critical', explanation: 'Mandatory for protecting REST API endpoints with authentication.' }
        ],
        recruiterPriority: ['Spring Boot 3', 'Spring Data JPA', 'Spring Security JWT', 'Docker'],
        applicationAdvice: 'Start submitting applications once Phase 3 is completed.',
        pitfalls: ['Creating monolithic God-classes instead of layered architecture.'],
        categories: [
          { category: 'Core Languages & JVM', icon: Terminal, skills: [{ name: 'Java 17', level: 'Strong', percent: 88 }] },
          { category: 'Frameworks & Enterprise', icon: Cpu, skills: [{ name: 'Spring Boot 3', level: 'Intermediate', percent: 65 }] }
        ]
      };
    }

    return {
      currentLevel: `${goalStr} Practitioner`,
      strong: [
        { name: `${goalStr} Core`, status: 'Strong', priority: 'Critical', explanation: 'Foundational domain principles required for software development.' }
      ],
      needs: [
        { name: 'System Architecture', status: 'Needs Improvement', priority: 'Critical', explanation: 'Crucial for designing modular, maintainable systems.' }
      ],
      missing: [
        { name: 'Cloud / CI Deployment', status: 'Missing', priority: 'Critical', explanation: 'Automates building, testing, and shipping applications.' }
      ],
      recruiterPriority: [`${goalStr} Architecture`, 'System Integration', 'Automated Verification'],
      applicationAdvice: `Start submitting job applications after completing Phase 3.`,
      pitfalls: ['Reading documentation passively without writing code daily.'],
      categories: [
        { category: 'Domain Fundamentals', icon: Terminal, skills: [{ name: `${goalStr} Core`, level: 'Strong', percent: 85 }] }
      ]
    };
  };

  const domainDefaults = getDomainDefaults(currentGoalStr);

  const rawSteps = (roadmapData && Array.isArray(roadmapData.roadmap) && roadmapData.roadmap.length > 0)
    ? roadmapData.roadmap
    : [];

  // Persistent Progress Tracking in localStorage Scoped to Unique roadmapId
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Re-initialize state whenever roadmapId changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setCompletedTopics(saved ? JSON.parse(saved) : {});
    } catch (e) {
      setCompletedTopics({});
    }
    setExpandedStepIndex(0);
    setReviewMode(false);
  }, [roadmapId, STORAGE_KEY]);

  // Persist topics progress scoped to this specific roadmapId
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTopics));
    } catch (e) {}
  }, [completedTopics, STORAGE_KEY]);

  const toggleTopic = (stepIdx, topicIdx) => {
    const key = `step_${stepIdx}_topic_${topicIdx}`;
    setCompletedTopics((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const calculateTopicCounts = () => {
    let total = 0;
    let completed = 0;

    rawSteps.forEach((step, sIdx) => {
      const topicsList = Array.isArray(step?.topics) ? step.topics : (Array.isArray(step?.skills) ? step.skills : []);
      topicsList.forEach((_, tIdx) => {
        total++;
        if (completedTopics[`step_${sIdx}_topic_${tIdx}`]) completed++;
      });
    });

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  };

  const { total: totalTopicsCount, percent: progressPercent } = calculateTopicCounts();

  // Trigger Subtle Inline Celebration Once on 100% Completion
  useEffect(() => {
    if (progressPercent === 100) {
      try {
        const hasBeenCelebrated = localStorage.getItem(CELEBRATED_KEY);
        if (!hasBeenCelebrated) {
          localStorage.setItem(CELEBRATED_KEY, 'true');
          triggerSubtleCelebration();
        }

        // Persist Unlocked Achievement Badge
        const savedAchievements = JSON.parse(localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY) || '[]');
        const exists = savedAchievements.some(a => a.title === achievementBadge.title);
        if (!exists) {
          const updated = [...savedAchievements, { ...achievementBadge, goal: currentGoalStr, unlockedAt: new Date().toISOString() }];
          localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updated));
        }
      } catch (e) {}
    }
  }, [progressPercent, CELEBRATED_KEY, achievementBadge, currentGoalStr]);

  const strongSkillItems = (Array.isArray(roadmapData?.alreadyStrongSkills) && roadmapData.alreadyStrongSkills.length > 0)
    ? roadmapData.alreadyStrongSkills.map(s => typeof s === 'string' ? s : s.name)
    : domainDefaults.strong.map(s => s.name);

  const needsSkillItems = (Array.isArray(roadmapData?.needsImprovementSkills) && roadmapData.needsImprovementSkills.length > 0)
    ? roadmapData.needsImprovementSkills.map(s => typeof s === 'string' ? s : s.name)
    : domainDefaults.needs.map(s => s.name);

  const recruiterPrioritySkills = (Array.isArray(roadmapData?.recruiterPrioritySkills) && roadmapData.recruiterPrioritySkills.length > 0)
    ? roadmapData.recruiterPrioritySkills
    : domainDefaults.recruiterPriority;

  const allLearnedSkills = Array.from(
    new Set([...strongSkillItems, ...needsSkillItems, ...recruiterPrioritySkills])
  );

  const candidateCurrentLevel = roadmapData?.currentLevel || domainDefaults.currentLevel;

  const toggleStepAccordion = (index) => {
    setExpandedStepIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto overflow-x-hidden relative">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#30363D]">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors self-start cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Create Another Learning Plan
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono">
            Goal: <strong className="text-white">{currentGoalStr}</strong>
          </span>
          <button
            onClick={onReset}
            className="px-3 py-1.5 bg-[#161B22] hover:bg-[#21262d] text-xs font-medium text-gray-300 hover:text-white rounded flex items-center gap-1.5 transition-colors border border-[#30363D] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Change Goal
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MINIMAL, PREMIUM ROADMAP COMPLETION VIEW (WHEN progressPercent === 100) */}
      {/* ========================================================================= */}
      {progressPercent === 100 ? (
        <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn py-2">
          
          {/* SECTION 1: Large Inline Success Header */}
          <div className="text-center space-y-2 py-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 text-3xl mb-1">
              🎉
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Roadmap Completed
            </h1>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Congratulations! You've successfully completed your personalized learning roadmap.
            </p>
          </div>

          {/* SECTION 1.5: Achievement Banner */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex items-center gap-5 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl flex-shrink-0">
              {achievementBadge.icon}
            </div>
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {achievementBadge.title}
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                {achievementBadge.desc}
              </p>
            </div>
          </div>

          {/* SECTION 2: Quick Stats Row (4 Compact Metric-Only Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Stat 1: Career Goal */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Career Goal
              </span>
              <div className="text-sm font-bold text-white truncate" title={currentGoalStr}>
                {currentGoalStr}
              </div>
            </div>

            {/* Stat 2: Topics Completed */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Topics Completed
              </span>
              <div className="text-sm font-bold text-white font-mono">
                {totalTopicsCount} Modules
              </div>
            </div>

            {/* Stat 3: Interview Readiness */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Interview Readiness
              </span>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                {roadmapData?.readinessScore || 95}%
              </div>
            </div>

            {/* Stat 4: Estimated Time */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Estimated Time
              </span>
              <div className="text-sm font-bold text-purple-400 font-mono">
                {roadmapData?.estimatedDuration || '12 Weeks'}
              </div>
            </div>

          </div>

          {/* SECTION 3: Skills Mastered (Full-Width Container) */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#30363D] pb-3">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Skills You've Mastered
              </h3>
              <span className="text-xs text-gray-400 font-mono">
                {allLearnedSkills.length} Core Competencies
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {allLearnedSkills && allLearnedSkills.length > 0 ? (
                allLearnedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400 italic">All Core Skills Mastered</span>
              )}
            </div>
          </div>

          {/* SECTION 4: AI Mentor Feedback */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 space-y-2">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              AI Mentor Feedback
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
              "Excellent work. You've completed the core skills required for entry-level {currentGoalStr} roles. Focus next on building strong portfolio projects and practicing technical interviews."
            </p>
          </div>

          {/* SECTION 4.5: Learning Summary & Skills Covered Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Learning Summary Card */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-extrabold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Learning Summary</span>
              </h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <span className="text-gray-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Skills Mastered</span>
                  </span>
                  <strong className="text-white font-mono">{allLearnedSkills.length} Core Competencies</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <span className="text-gray-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Learning Modules Completed</span>
                  </span>
                  <strong className="text-white font-mono">{rawSteps.length} Structured Phases ({totalTopicsCount} Topics)</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <span className="text-gray-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Portfolio Projects Recommended</span>
                  </span>
                  <strong className="text-white font-mono">{rawSteps.length} Capstone Projects</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <span className="text-gray-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Interview Readiness Status</span>
                  </span>
                  <strong className="text-emerald-400 font-bold font-mono">{roadmapData?.readinessScore || 95}% Interview Ready</strong>
                </div>
              </div>
            </div>

            {/* Skills Covered Card */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-extrabold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span>Skills Covered</span>
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono">{allLearnedSkills.length} Total</span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {allLearnedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-gray-400 italic pt-2 border-t border-[#30363D]">
                All essential frameworks, architecture patterns, and domain topics required for {currentGoalStr}.
              </p>
            </div>

          </div>

          {/* SECTION 5: Next Recommended Steps & Primary Actions */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 space-y-6 shadow-xl">
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-white tracking-tight">
                Next Recommended Steps
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Build 3 portfolio projects using mastered skills</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Practice core technical DSA & system fundamentals</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Prepare for technical & behavioral interviews</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Apply for active {currentGoalStr} job postings</span>
                </div>
              </div>
            </div>

            {/* Helper text for Generate Another Roadmap */}
            <div className="text-xs text-gray-400 pt-2 border-t border-[#30363D] flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Generate another roadmap by analyzing a different job description or changing your target role.</span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/app/mock-interview', { state: { prefilledRole: currentGoalStr } })}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Continue to AI Mock Interview</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/app/job-matcher')}
                className="px-4 py-2.5 bg-[#0D1117] hover:bg-[#21262d] text-blue-400 hover:text-blue-300 border border-blue-500/30 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Target className="w-4 h-4" />
                <span>Match Against Jobs</span>
              </button>

              <button
                onClick={onReset}
                className="px-4 py-2.5 bg-[#0D1117] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Generate Another Roadmap</span>
              </button>
            </div>
          </div>

          {/* Subtle Optional Review Toggle */}
          <div className="pt-4 text-center">
            <button
              onClick={() => setReviewMode((prev) => !prev)}
              className="text-xs text-gray-400 hover:text-white underline transition-colors cursor-pointer"
            >
              {reviewMode ? 'Hide Detailed Timeline' : 'Review Completed Timeline Steps'}
            </button>
          </div>

          {reviewMode && (
            <div className="pt-4 border-t border-[#30363D] space-y-6">
              <div className="bg-[#161B22] rounded-lg p-6 border border-[#30363D] space-y-4">
                <h3 className="text-sm font-bold text-white">Completed Phases Review</h3>
                <div className="space-y-3">
                  {rawSteps.map((step, sIdx) => (
                    <div key={sIdx} className="p-3 rounded bg-[#0D1117] border border-[#30363D] text-xs text-gray-300 flex items-center justify-between">
                      <span className="font-semibold text-white">Phase {sIdx + 1}: {step?.title || step?.phaseName || 'Learning Phase'}</span>
                      <span className="text-green-400 font-bold">✓ Complete</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* ========================================================================= */
        /* STANDARD IN-PROGRESS ROADMAP VIEW */
        /* ========================================================================= */
        <div className="space-y-8">
          
          <PageHeader
            title="Learning Roadmap Report"
            subtitle={`Target Role: ${currentGoalStr}`}
            onBack={onReset}
            backLabel="Back to Learning Roadmap"
            actions={
              <button
                onClick={onReset}
                className="px-3.5 py-2.5 bg-[#161B22] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                <span>Create Another Plan</span>
              </button>
            }
          />
          
          {/* CAREER READINESS CARD */}
          <div className="bg-[#161B22] rounded-lg p-6 border-2 border-blue-500/30 space-y-5 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#30363D]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-500 border border-blue-500/30 flex items-center justify-center font-bold">
                  <Compass className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight">Career Readiness Overview</h3>
                  <p className="text-xs text-gray-400">Snapshot summary: current standing, target goal & immediate learning priorities</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-green-600/10 border border-green-500/20 text-xs font-bold text-green-400 self-start sm:self-auto">
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                <span>{roadmapData?.readinessScore || 92}% Job Readiness Score</span>
              </div>
            </div>

            {/* 5-Column Dynamic Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              
              {/* Where am I now? */}
              <div className="p-3.5 rounded bg-[#0D1117] border border-[#30363D] space-y-1 min-w-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block truncate">Where Am I Now?</span>
                <div className="text-xs font-bold text-white">Current Level</div>
                <div className="text-xs text-blue-400 font-semibold truncate block whitespace-nowrap overflow-hidden text-ellipsis" title={candidateCurrentLevel}>{candidateCurrentLevel}</div>
              </div>

              {/* Where am I going? */}
              <div className="p-3.5 rounded bg-[#0D1117] border border-[#30363D] space-y-1 min-w-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block truncate">Where Am I Going?</span>
                <div className="text-xs font-bold text-white">Target Goal</div>
                <div className="text-xs text-blue-400 font-semibold truncate block whitespace-nowrap overflow-hidden text-ellipsis" title={currentGoalStr}>{currentGoalStr}</div>
              </div>

              {/* Strong Skills */}
              <div className="p-3.5 rounded bg-[#0D1117] border border-[#30363D] space-y-1 min-w-0">
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider block truncate">Strong Skills</span>
                <div className="flex flex-col gap-1 pt-0.5 min-w-0">
                  {strongSkillItems.slice(0, 2).map((name, idx) => (
                    <span key={idx} title={name} className="px-2 py-0.5 rounded bg-green-600/10 border border-green-500/20 text-[10px] font-bold text-green-400 truncate block whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* What To Learn Next? */}
              <div className="p-3.5 rounded bg-[#0D1117] border border-[#30363D] space-y-1 min-w-0">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block truncate">What To Learn Next?</span>
                <div className="flex flex-col gap-1 pt-0.5 min-w-0">
                  {needsSkillItems.slice(0, 2).map((name, idx) => (
                    <span key={idx} title={name} className="px-2 py-0.5 rounded bg-amber-600/10 border border-amber-500/20 text-[10px] font-bold text-amber-400 truncate block whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Estimated Time */}
              <div className="p-3.5 rounded bg-[#0D1117] border border-[#30363D] space-y-1 min-w-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block truncate">Estimated Time</span>
                <div className="text-base font-extrabold text-white font-mono">12 Weeks</div>
                <div className="text-[10px] text-gray-400 truncate">{rawSteps.length} Learning Phases</div>
              </div>

            </div>
          </div>

          {/* ACCORDION ROADMAP PLAN SECTION */}
          <div id="roadmap-phases-plan-section" className="bg-[#161B22] rounded-lg p-6 border border-[#30363D] space-y-6">
            
            {/* Plan Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#30363D]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Your Personalized Learning Plan ({rawSteps.length} Meaningful Phases)
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Click any phase to expand its mentor guidance, resume-worthy project, skills, and resources.
                </p>
              </div>

              <div className="bg-[#0D1117] px-4 py-2 rounded border border-[#30363D] text-center sm:text-right">
                <span className="text-[11px] text-gray-400 block font-mono">Overall Completion</span>
                <span className="text-lg font-bold text-green-400 font-mono">{progressPercent}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#0D1117] h-2 rounded-full overflow-hidden border border-[#30363D]">
              <div
                className="bg-green-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* ACCORDION STEPS LIST */}
            <div className="space-y-4 pt-2">
              {rawSteps.map((step, sIdx) => {
                const isExpanded = expandedStepIndex === sIdx;
                const phaseLabel = step?.phaseName || `Phase ${sIdx + 1}`;
                const rawTitle = step?.title || step?.month || step?.stepTitle || step?.name || `Learning Goals`;
                const cleanTitle = (typeof rawTitle === 'string' && rawTitle)
                  ? rawTitle.replace(/^Stage \d+: /, '').replace(/^Month \d+: /, '').replace(/^Step \d+: /, '').replace(/^Phase \d+: /, '') 
                  : 'Learning Goals';

                const rawProject = step?.project || step?.projects || step?.capstoneProject;
                let projectObj;
                if (typeof rawProject === 'object' && rawProject !== null && !Array.isArray(rawProject)) {
                  projectObj = rawProject;
                } else {
                  projectObj = {
                    name: `${currentGoalStr} Practical Project`,
                    difficulty: sIdx === 0 ? 'Intermediate' : sIdx === 1 ? 'Advanced' : 'Production-Grade',
                    estimatedDuration: `${sIdx + 1} Week(s)`,
                    desc: typeof rawProject === 'string' ? rawProject : `Build a real-world application integrating key concepts of ${currentGoalStr}.`,
                    skillsPracticed: [currentGoalStr, "Domain Architecture", "Testing"],
                    whyRecruitersLikeIt: `Proves real-world execution and hands-on competence in ${currentGoalStr}.`,
                    resumeValue: `Built a scalable ${currentGoalStr} application featuring automated testing and modular design.`,
                    stretchGoals: ['Add automated unit test suite', 'Configure CI/CD release workflow']
                  };
                }

                const topicsList = Array.isArray(step?.topics) ? step.topics : (
                  Array.isArray(step?.skills) ? step.skills : [
                    `${currentGoalStr} Fundamentals & Best Practices`,
                    "Hands-on Implementation & System Design",
                    "Performance Optimization & Production Readiness"
                  ]
                );

                const rawResources = step?.resources || step?.documentation;
                const resourcesList = Array.isArray(rawResources) && rawResources.length > 0
                  ? rawResources.map((res, rIdx) => {
                      if (typeof res === 'object' && res !== null) return res;
                      return {
                        type: rIdx === 0 ? 'doc' : rIdx === 1 ? 'video' : 'practice',
                        label: rIdx === 0 ? 'Official Documentation' : rIdx === 1 ? 'YouTube Course' : 'Practice Platform',
                        title: typeof res === 'string' ? res : `${currentGoalStr} Resource`,
                        source: rIdx === 0 ? 'Docs' : rIdx === 1 ? 'freeCodeCamp' : 'LeetCode',
                        url: rIdx === 0 ? 'https://developer.mozilla.org' : rIdx === 1 ? 'https://www.youtube.com/@freecodecamp' : 'https://leetcode.com',
                        icon: rIdx === 0 ? '📘' : rIdx === 1 ? '🎥' : '💻'
                      };
                    })
                  : [
                      { type: 'doc', label: 'Official Documentation', title: `${currentGoalStr} Official Docs`, source: 'Official Docs', url: 'https://developer.mozilla.org', icon: '📘' },
                      { type: 'video', label: 'YouTube Course', title: `${currentGoalStr} Full Course`, source: 'freeCodeCamp', url: 'https://www.youtube.com/@freecodecamp', icon: '🎥' },
                      { type: 'practice', label: 'Practice Platform', title: 'Coding Exercises & Challenges', source: 'LeetCode', url: 'https://leetcode.com', icon: '💻' }
                    ];

                return (
                  <div
                    key={sIdx}
                    className={`bg-[#0D1117] rounded-lg border transition-all duration-200 overflow-hidden ${
                      isExpanded ? 'border-blue-500/50 shadow-md' : 'border-[#30363D] hover:border-gray-500'
                    }`}
                  >
                    {/* Collapsed Step Header */}
                    <button
                      type="button"
                      onClick={() => toggleStepAccordion(sIdx)}
                      className="w-full p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left focus:outline-none cursor-pointer"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 font-bold text-xs border border-blue-500/30 flex-shrink-0">
                          Phase {sIdx + 1}: {phaseLabel}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                          {cleanTitle}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-300 self-start md:self-auto">
                        <span>Estimated Time: <strong className="text-white font-mono">{step?.estimatedTime || step?.duration || '3 Weeks'}</strong></span>
                        <span className="px-2 py-0.5 rounded bg-[#161B22] border border-[#30363D] text-[11px] font-medium text-gray-300">
                          Difficulty: <strong className="text-blue-400">{step?.difficulty || (sIdx === 0 ? 'Intermediate' : sIdx === 1 ? 'Advanced' : 'Production-Grade')}</strong>
                        </span>
                        <div className="w-7 h-7 rounded bg-[#161B22] border border-[#30363D] flex items-center justify-center text-gray-400 ml-1">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Step Body */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 border-t border-[#30363D] space-y-6 animate-fadeIn">
                        
                        {/* MENTOR INSIGHTS ROW */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-3.5 rounded bg-[#161B22] border border-[#30363D] space-y-1">
                            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-blue-500" /> Why This Phase Matters
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed font-medium">
                              {step?.whyItMatters || `Mastering this phase builds core architectural confidence required for production engineering.`}
                            </p>
                          </div>

                          <div className="p-3.5 rounded bg-[#161B22] border border-[#30363D] space-y-1">
                            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Prerequisites
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed font-medium">
                              {step?.prerequisites || `Basic understanding of data structures, control flow, and fundamental syntax.`}
                            </p>
                          </div>

                          <div className="p-3.5 rounded bg-[#161B22] border border-[#30363D] space-y-1">
                            <div className="text-[11px] font-bold text-green-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-green-500" /> When To Start Building
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed font-medium">
                              {step?.whenToBuild || `Read topics for 3-4 days, then immediately start building the capstone project hands-on.`}
                            </p>
                          </div>
                        </div>

                        {/* Checkable Topics */}
                        <div className="space-y-2.5">
                          <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-blue-500" />
                            Skills You'll Learn in {phaseLabel}
                          </div>
                          <div className="space-y-2">
                            {topicsList.map((topic, tIdx) => {
                              const isDone = completedTopics[`step_${sIdx}_topic_${tIdx}`];
                              return (
                                <div
                                  key={tIdx}
                                  onClick={() => toggleTopic(sIdx, tIdx)}
                                  className={`p-3 rounded border text-xs flex items-start gap-3 transition-all duration-200 ease-out cursor-pointer ${
                                    isDone
                                      ? 'bg-green-600/10 border-green-500/30 text-green-300'
                                      : 'bg-[#161B22] border-[#30363D] text-gray-200 hover:border-gray-500'
                                  }`}
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                  )}
                                  <span className={`leading-relaxed transition-all duration-200 ${isDone ? 'line-through opacity-70 text-green-300 font-medium' : ''}`}>
                                    {topic}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* HIGHLIGHTED CAPSTONE PROJECT */}
                        <div className="p-5 rounded bg-[#161B22] border-2 border-blue-500/40 space-y-4 shadow-md">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#30363D]">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase bg-blue-600/20 text-blue-400 border-blue-500/30">
                                  {projectObj.difficulty || 'Capstone'} Project
                                </span>
                                <span className="text-[11px] text-gray-400 font-mono">
                                  Est. Duration: <strong className="text-white">{projectObj.estimatedDuration || '1 Week'}</strong>
                                </span>
                              </div>
                              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                                <Award className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                {projectObj.name}
                              </h4>
                            </div>
                          </div>

                          <p className="text-xs text-gray-200 leading-relaxed font-medium">
                            {projectObj.desc}
                          </p>

                          {projectObj.whyRecruitersLikeIt && (
                            <div className="p-3 rounded bg-[#0D1117] border border-[#30363D] space-y-1">
                              <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Why Recruiters Like This Project
                              </div>
                              <p className="text-xs text-gray-300 leading-relaxed font-medium">
                                {projectObj.whyRecruitersLikeIt}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* LEARNING RESOURCES */}
                        <div className="space-y-2.5">
                          <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                            Learning Resources
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {resourcesList.slice(0, 3).map((res, rIdx) => (
                              <a
                                key={rIdx}
                                href={res.url || 'https://developer.mozilla.org'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-3 rounded bg-[#161B22] hover:bg-[#21262d] border border-[#30363D] hover:border-blue-500/50 space-y-1.5 transition-all duration-200 flex flex-col justify-between cursor-pointer"
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <div className="text-[11px] font-bold text-blue-400 flex items-center gap-1.5 truncate">
                                    <span>{res.icon || '📘'}</span>
                                    <span className="truncate">{res.label || 'Resource'}</span>
                                  </div>
                                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                                </div>
                                <div className="text-xs text-gray-200 font-medium line-clamp-1 group-hover:text-white transition-colors">
                                  {res.title}
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* SECTION 5: Next Recommended Steps & Primary Actions */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 space-y-6 shadow-xl mt-8">
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-white tracking-tight">
                Next Recommended Steps
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Build 3 portfolio projects using mastered skills</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Practice core technical DSA & system fundamentals</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Prepare for technical & behavioral interviews</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Apply for active {currentGoalStr} job postings</span>
                </div>
              </div>
            </div>

            {/* Helper text for Generate Another Roadmap */}
            <div className="text-xs text-gray-400 pt-2 border-t border-[#30363D] flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Generate another roadmap by analyzing a different job description or changing your target role.</span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/app/mock-interview', { state: { prefilledRole: currentGoalStr } })}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Continue to AI Mock Interview</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/app/job-matcher')}
                className="px-4 py-2.5 bg-[#0D1117] hover:bg-[#21262d] text-blue-400 hover:text-blue-300 border border-blue-500/30 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Target className="w-4 h-4" />
                <span>Match Against Jobs</span>
              </button>

              <button
                onClick={onReset}
                className="px-4 py-2.5 bg-[#0D1117] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Generate Another Roadmap</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
