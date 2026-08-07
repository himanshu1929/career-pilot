import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const WORKSPACE_STORAGE_KEY = 'career_pilot_workspace_v1';

const initialWorkspaceState = {
  profile: null, // { name, goal, experience, completedOnboarding }
  hasVisitedDashboard: false,
  resumeHistory: [],
  jobMatches: [],
  roadmaps: [],
  interviews: [],
  activities: []
};

const WorkspaceContext = createContext(null);

export const WorkspaceProvider = ({ children }) => {
  const [workspace, setWorkspaceState] = useState(() => {
    try {
      const saved = localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          profile: parsed.profile || null,
          hasVisitedDashboard: parsed.hasVisitedDashboard || false,
          resumeHistory: Array.isArray(parsed.resumeHistory) ? parsed.resumeHistory : [],
          jobMatches: Array.isArray(parsed.jobMatches) ? parsed.jobMatches : [],
          roadmaps: Array.isArray(parsed.roadmaps) ? parsed.roadmaps : [],
          interviews: Array.isArray(parsed.interviews) ? parsed.interviews : [],
          activities: Array.isArray(parsed.activities) ? parsed.activities : []
        };
      }
    } catch (e) {}

    // Legacy fallback migration helper
    try {
      const savedProfile = localStorage.getItem('career_pilot_user_profile');
      const savedHistory = localStorage.getItem('career_pilot_resume_history');
      const profile = savedProfile ? JSON.parse(savedProfile) : null;
      const resumeHistory = savedHistory ? JSON.parse(savedHistory) : [];

      return {
        ...initialWorkspaceState,
        profile,
        resumeHistory
      };
    } catch (e) {
      return initialWorkspaceState;
    }
  });

  // In-Memory Shared File Handle for Guided Workflows (Not serialized to localStorage)
  const [activeResumeFile, setActiveResumeFile] = useState(null);
  const [roadmapSeed, setRoadmapSeedState] = useState(null);

  const setSharedResumeFile = (file) => {
    if (file && (file instanceof File || file instanceof Blob)) {
      setActiveResumeFile(file);
    } else {
      setActiveResumeFile(null);
    }
  };

  const clearSharedResumeFile = () => {
    setActiveResumeFile(null);
  };

  const setRoadmapSeed = (seedData) => {
    setRoadmapSeedState(seedData);
  };

  const clearRoadmapSeed = () => {
    setRoadmapSeedState(null);
  };

  // Sync workspace state to localStorage on any modification
  useEffect(() => {
    try {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace));
    } catch (e) {}
  }, [workspace]);

  // Profile Actions
  const updateProfile = (fields) => {
    setWorkspaceState((prev) => ({
      ...prev,
      profile: { ...(prev.profile || {}), ...fields }
    }));
  };

  const markDashboardVisited = () => {
    setWorkspaceState((prev) => ({
      ...prev,
      hasVisitedDashboard: true
    }));
  };

  // Resume Actions (Single Source of Truth & Unique Hash Overwrite)
  const addResumeAnalysis = (newAnalysis) => {
    setWorkspaceState((prev) => {
      const hash = newAnalysis.contentHash;
      const existingItem = hash ? prev.resumeHistory.find(h => h.contentHash === hash) : null;
      
      const id = existingItem?.id || newAnalysis.id || `res_${Date.now()}`;
      const timestamp = newAnalysis.uploadedAt || newAnalysis.timestamp || new Date().toISOString();
      const filename = newAnalysis.filename || existingItem?.filename || 'Uploaded_Resume.pdf';
      const score = newAnalysis.score || newAnalysis.resumeScore || 85;

      const itemToSave = {
        ...existingItem,
        ...newAnalysis,
        id,
        filename,
        contentHash: hash,
        uploadedAt: timestamp,
        formattedDate: new Date(timestamp).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }),
        formattedTime: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        resumeScore: score,
        atsScore: newAnalysis.atsScore || score
      };

      // Filter out any matching existing item to guarantee 1 unique entry per contentHash in history
      const filtered = prev.resumeHistory.filter(h => h.id !== id && (hash ? h.contentHash !== hash : true));
      const updatedHistory = [itemToSave, ...filtered];

      const newActivity = {
        id: `act_${Date.now()}`,
        type: 'resume',
        title: `Scanned Resume: ${filename}`,
        detail: `ATS Score: ${itemToSave.atsScore}% • ${itemToSave.candidateLevel || 'Scanned Report'}`,
        badge: `Score ${score}`,
        badgeColor: 'bg-green-500/10 text-green-400 border-green-500/30',
        timestamp: 'Just now',
        dateIso: timestamp
      };

      return {
        ...prev,
        resumeHistory: updatedHistory,
        activities: [newActivity, ...prev.activities]
      };
    });
  };

  const deleteResumeAnalysis = (id) => {
    setWorkspaceState((prev) => {
      const deletedItem = prev.resumeHistory.find(item => item.id === id);
      const updatedHistory = prev.resumeHistory.filter(item => item.id !== id);

      // Clean up corresponding activity items
      const updatedActivities = prev.activities.filter(act => {
        if (act.type === 'resume' && deletedItem) {
          if (act.title.includes(deletedItem.filename) || (deletedItem.originalName && act.title.includes(deletedItem.originalName))) {
            return false;
          }
        }
        return true;
      });

      return {
        ...prev,
        resumeHistory: updatedHistory,
        activities: updatedActivities
      };
    });
  };

  const clearResumeHistory = () => {
    setWorkspaceState((prev) => ({
      ...prev,
      resumeHistory: [],
      activities: prev.activities.filter(act => act.type !== 'resume')
    }));
  };

  // Job Match Actions
  const addJobMatch = (jobMatchData) => {
    setWorkspaceState((prev) => {
      const timestamp = new Date().toISOString();
      const formattedDate = new Date(timestamp).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
      const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const itemToSave = {
        id: `jm_${Date.now()}`,
        timestamp,
        formattedDate,
        formattedTime,
        companyName: jobMatchData.companyName || 'Target Company',
        targetJobTitle: jobMatchData.targetJobTitle || jobMatchData.jobTitle || 'Target Role',
        matchScore: Number(jobMatchData.matchScore || jobMatchData.overallScore || jobMatchData.matchPercentage || 85),
        resumeFileName: jobMatchData.resumeFileName || jobMatchData.filename || 'Uploaded_Resume.pdf',
        missingSkills: Array.isArray(jobMatchData.missingSkills) ? jobMatchData.missingSkills : (jobMatchData.data?.missingSkills || []),
        ...jobMatchData
      };

      const score = itemToSave.matchScore;
      const company = itemToSave.companyName;
      const role = itemToSave.targetJobTitle;

      const newActivity = {
        id: `act_${Date.now()}`,
        type: 'job-match',
        title: `Matched: ${company} (${role})`,
        detail: `Match Score: ${score}% against target position`,
        badge: `${score}% Match`,
        badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        timestamp: 'Just now',
        dateIso: timestamp
      };

      const filtered = prev.jobMatches.filter(m => m.id !== itemToSave.id);

      return {
        ...prev,
        jobMatches: [itemToSave, ...filtered],
        activities: [newActivity, ...prev.activities]
      };
    });
  };

  const deleteJobMatch = (id) => {
    setWorkspaceState((prev) => ({
      ...prev,
      jobMatches: prev.jobMatches.filter(item => item.id !== id),
      activities: prev.activities.filter(act => act.id !== id)
    }));
  };

  const clearJobMatchHistory = () => {
    setWorkspaceState((prev) => ({
      ...prev,
      jobMatches: [],
      activities: prev.activities.filter(act => act.type !== 'job-match')
    }));
  };

  // Roadmap Actions
  const saveRoadmap = (roadmapData) => {
    setWorkspaceState((prev) => {
      const timestamp = new Date().toISOString();
      const roadmapId = roadmapData.roadmapId || roadmapData.id || `rm_${(roadmapData.targetRole || 'goal').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
      
      const roadmapObj = {
        ...roadmapData,
        roadmapId,
        createdAt: timestamp,
        progress: prev.roadmaps.find(r => r.roadmapId === roadmapId)?.progress || {}
      };

      const filteredRoadmaps = prev.roadmaps.filter(r => r.roadmapId !== roadmapId);
      const updatedRoadmaps = [roadmapObj, ...filteredRoadmaps];

      const newActivity = {
        id: `act_${Date.now()}`,
        type: 'roadmap',
        title: `Generated Roadmap: ${roadmapData.targetRole || 'Learning Plan'}`,
        detail: `Step-by-step learning roadmap created`,
        badge: 'Active Roadmap',
        badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        timestamp: 'Just now',
        dateIso: timestamp
      };

      return {
        ...prev,
        roadmaps: updatedRoadmaps,
        activities: [newActivity, ...prev.activities]
      };
    });
  };

  const updateRoadmapProgress = (roadmapId, topicKey, isCompleted) => {
    setWorkspaceState((prev) => {
      const updatedRoadmaps = prev.roadmaps.map((r) => {
        if (r.roadmapId === roadmapId) {
          const newProgress = { ...(r.progress || {}), [topicKey]: isCompleted };
          return { ...r, progress: newProgress };
        }
        return r;
      });

      return {
        ...prev,
        roadmaps: updatedRoadmaps
      };
    });
  };

  const deleteRoadmap = (roadmapId) => {
    setWorkspaceState((prev) => {
      try {
        if (roadmapId) {
          localStorage.removeItem(`career_pilot_roadmap_progress_${roadmapId}`);
          localStorage.removeItem(`career_pilot_roadmap_celebrated_${roadmapId}`);
        }
      } catch (e) {}

      return {
        ...prev,
        roadmaps: prev.roadmaps.filter(r => r.roadmapId !== roadmapId),
        activities: prev.activities.filter(act => !act.title.includes(roadmapId))
      };
    });
  };

  const clearRoadmaps = () => {
    setWorkspaceState((prev) => {
      try {
        prev.roadmaps.forEach(r => {
          if (r.roadmapId) {
            localStorage.removeItem(`career_pilot_roadmap_progress_${r.roadmapId}`);
            localStorage.removeItem(`career_pilot_roadmap_celebrated_${r.roadmapId}`);
          }
        });
      } catch (e) {}

      return {
        ...prev,
        roadmaps: [],
        activities: prev.activities.filter(act => act.type !== 'roadmap')
      };
    });
  };

  // Interview Actions
  const addInterview = (interviewData) => {
    setWorkspaceState((prev) => {
      const timestamp = new Date().toISOString();
      const role = interviewData.targetRole || 'Software Engineer';
      const score = interviewData.score || 80;
      const diff = interviewData.difficulty || 'Medium';

      const itemToSave = {
        id: `int_${Date.now()}`,
        timestamp,
        formattedDate: new Date(timestamp).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }),
        formattedTime: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...interviewData
      };

      const newActivity = {
        id: `act_${Date.now()}`,
        type: 'interview',
        title: `AI Mock Interview: ${role}`,
        detail: `Overall Score: ${score}% • ${diff} Difficulty`,
        badge: `${score}%`,
        badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        timestamp: 'Just now',
        dateIso: timestamp
      };

      return {
        ...prev,
        interviews: [itemToSave, ...prev.interviews],
        activities: [newActivity, ...prev.activities]
      };
    });
  };

  const deleteInterview = (id) => {
    setWorkspaceState((prev) => ({
      ...prev,
      interviews: prev.interviews.filter(item => item.id !== id)
    }));
  };

  const clearInterviewHistory = () => {
    setWorkspaceState((prev) => ({
      ...prev,
      interviews: [],
      activities: prev.activities.filter(act => act.type !== 'interview')
    }));
  };

  // Reset entire workspace to fresh state
  const resetWorkspace = () => {
    try {
      localStorage.removeItem(WORKSPACE_STORAGE_KEY);
      localStorage.removeItem('career_pilot_user_profile');
      localStorage.removeItem('career_pilot_resume_history');
    } catch (e) {}
    setWorkspaceState(initialWorkspaceState);
  };

  // Computed Workspace Statistics (Dynamic Single Source of Truth Metrics)
  const computedStats = useMemo(() => {
    const latestResume = workspace.resumeHistory[0];
    const latestAtsScore = latestResume
      ? Number(latestResume.atsScore ?? latestResume.score ?? latestResume.resumeScore ?? 0)
      : 0;
    const resumeCount = workspace.resumeHistory.length;

    const latestMatch = workspace.jobMatches[0];
    const jobMatchScore = latestMatch
      ? Number(latestMatch.overallScore ?? latestMatch.matchScore ?? latestMatch.score ?? 0)
      : 0;
    const totalJobMatches = workspace.jobMatches.length;
    const recentJobCompany = latestMatch ? (latestMatch.companyName || 'Target Company') : null;
    const recentJobRole = latestMatch ? (latestMatch.targetJobTitle || latestMatch.jobTitle || null) : null;

    const latestRoadmap = workspace.roadmaps[0];
    let roadmapPercent = 0;
    let activeRoadmapTitle = '';

    if (latestRoadmap) {
      activeRoadmapTitle = latestRoadmap.targetRole || 'Active Roadmap';
      const progressObj = latestRoadmap.progress || {};
      const totalTopics = (latestRoadmap.roadmap || []).reduce((acc, step) => acc + (step.topics?.length || 0), 0);
      const doneTopics = Object.values(progressObj).filter(Boolean).length;
      roadmapPercent = totalTopics > 0
        ? Math.round((doneTopics / totalTopics) * 100)
        : Number(latestRoadmap.progressPercent ?? 0);
    }

    const latestInterview = workspace.interviews[0];
    const interviewScore = latestInterview
      ? Number(latestInterview.overallScore ?? latestInterview.score ?? 0)
      : 0;
    const interviewCount = workspace.interviews.length;

    // Computed overall career readiness score
    const activeMetrics = [latestAtsScore, jobMatchScore, roadmapPercent, interviewScore].filter(val => val > 0);
    const overallCareerScore = activeMetrics.length > 0
      ? Math.round(activeMetrics.reduce((a, b) => a + b, 0) / activeMetrics.length)
      : 0;

    return {
      latestAtsScore,
      resumeScore: latestAtsScore,
      resumeCount,
      totalResumes: resumeCount,

      jobMatchScore,
      totalJobMatches,
      recentJobCompany,
      recentJobRole,

      roadmapPercent,
      roadmapProgress: roadmapPercent,
      activeRoadmapTitle,
      totalRoadmaps: workspace.roadmaps.length,

      interviewScore,
      interviewCount,
      totalInterviews: interviewCount,

      overallCareerScore
    };
  }, [workspace]);

  // Computed Journey Progression State
  const journeyState = useMemo(() => {
    const hasResume = workspace.resumeHistory.length > 0;
    const hasJobMatch = workspace.jobMatches.length > 0;
    const hasRoadmap = workspace.roadmaps.length > 0;
    const hasInterview = workspace.interviews.length > 0;

    let currentStepIndex = 0;
    let currentRecommendedStep = 'resume';

    if (!hasResume) {
      currentStepIndex = 0;
      currentRecommendedStep = 'resume';
    } else if (!hasJobMatch) {
      currentStepIndex = 1;
      currentRecommendedStep = 'jobMatch';
    } else if (!hasRoadmap) {
      currentStepIndex = 2;
      currentRecommendedStep = 'roadmap';
    } else if (!hasInterview) {
      currentStepIndex = 3;
      currentRecommendedStep = 'interview';
    } else {
      currentStepIndex = 4;
      currentRecommendedStep = 'complete';
    }

    return {
      hasResume,
      hasJobMatch,
      hasRoadmap,
      hasInterview,
      completed: {
        resume: hasResume,
        jobMatch: hasJobMatch,
        roadmap: hasRoadmap,
        interview: hasInterview
      },
      currentStepIndex,
      currentRecommendedStep,
      isFullyComplete: currentStepIndex === 4
    };
  }, [workspace]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        profile: workspace.profile,
        hasVisitedDashboard: workspace.hasVisitedDashboard,
        resumeHistory: workspace.resumeHistory,
        jobMatches: workspace.jobMatches,
        roadmaps: workspace.roadmaps,
        interviews: workspace.interviews,
        activities: workspace.activities,
        computedStats,
        journeyState,
        updateProfile,
        markDashboardVisited,
        addResumeAnalysis,
        deleteResumeAnalysis,
        clearResumeHistory,
        addJobMatch,
        deleteJobMatch,
        clearJobMatchHistory,
        saveRoadmap,
        updateRoadmapProgress,
        deleteRoadmap,
        clearRoadmaps,
        activeResumeFile,
        setSharedResumeFile,
        clearSharedResumeFile,
        roadmapSeed,
        setRoadmapSeed,
        clearRoadmapSeed,
        addInterview,
        deleteInterview,
        clearInterviewHistory,
        resetWorkspace
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

// Backwards compatibility alias hook
export const useProfile = () => {
  const { profile, updateProfile, resetWorkspace } = useWorkspace();
  return {
    profile,
    updateProfile,
    resetProfile: resetWorkspace
  };
};

export default WorkspaceContext;
