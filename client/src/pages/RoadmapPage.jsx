import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { RoadmapForm } from '../features/roadmap/RoadmapForm';
import { RoadmapTimeline } from '../features/roadmap/RoadmapTimeline';
import { RoadmapLoadingState } from '../features/roadmap/RoadmapLoadingState';
import { GuidedJourneyBanner } from '../components/layout/GuidedJourneyBanner';
import { QuotaLimitBanner } from '../components/common/QuotaLimitBanner';
import { generateDynamicRoadmap } from '../utils/roadmapGenerator';

const ROADMAP_MODE_STORAGE_KEY = 'career_pilot_roadmap_mode';

export const RoadmapPage = () => {
  const location = useLocation();
  const { roadmaps, saveRoadmap, clearRoadmaps, roadmapSeed, clearRoadmapSeed } = useWorkspace();

  // Check if navigated from Job Matcher with active seed
  const isFromJobMatcher = Boolean(location.state?.fromJobMatcher && roadmapSeed && roadmapSeed.source === 'jobMatcher');

  const [generating, setGenerating] = useState(false);
  const [targetRole, setTargetRole] = useState(roadmapSeed?.targetRole || '');
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [lastFormData, setLastFormData] = useState(null);

  // Initialize mode from sessionStorage to guarantee browser refresh stays on form if candidate clicked Create Another Plan
  const [isCreatingNew, setIsCreatingNew] = useState(() => {
    try {
      if (isFromJobMatcher) return true; // Force form view when arriving from Job Matcher
      return sessionStorage.getItem(ROADMAP_MODE_STORAGE_KEY) === 'create' || roadmaps.length === 0;
    } catch (e) {
      return false;
    }
  });

  // Active roadmap is current workspace roadmap unless candidate requested a new plan creation or arrived from Job Matcher
  const activeRoadmap = (isCreatingNew || isFromJobMatcher) ? null : (roadmaps[0] || null);

  const handleGenerateRoadmap = async (formData) => {
    const role = formData?.targetRole || targetRole || '';
    const skills = formData?.currentSkills || '';
    const missing = formData?.missingSkills || (isFromJobMatcher ? roadmapSeed?.missingSkills : []) || [];
    const level = formData?.experienceLevel || '';

    setLastFormData(formData);
    setTargetRole(role);
    setGenerating(true);
    setIsQuotaExceeded(false);
    setIsCreatingNew(false);

    try {
      sessionStorage.removeItem(ROADMAP_MODE_STORAGE_KEY);
    } catch (e) {}

    const timestamp = Date.now();
    const newRoadmapId = `rm_${role.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${timestamp}`;

    try {
      const response = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: role,
          currentSkills: skills,
          missingSkills: missing,
          experienceLevel: level
        })
      });

      let resData = {};
      try {
        resData = await response.json();
      } catch (e) {}

      // Handle AI Quota Exhaustion or Backend Errors
      if (
        !response.ok ||
        response.status === 429 || 
        resData.errorType === 'QUOTA_EXCEEDED' || 
        resData.errorType === 'RESOURCE_EXHAUSTED' ||
        (resData.message && (resData.message.includes('quota') || resData.message.includes('RESOURCE_EXHAUSTED')))
      ) {
        setIsQuotaExceeded(true);
        setGenerating(false);
        setIsCreatingNew(true);
        try {
          sessionStorage.setItem(ROADMAP_MODE_STORAGE_KEY, 'create');
        } catch (e) {}
        return;
      }

      if (resData && resData.data) {
        const fullData = resData.data.roadmap ? resData.data : { roadmap: resData.data };
        if (Array.isArray(fullData.roadmap) && fullData.roadmap.length > 0) {
          const finalData = {
            ...fullData,
            roadmapId: fullData.roadmapId || newRoadmapId,
            createdAt: timestamp
          };

          saveRoadmap(finalData);
          clearRoadmapSeed();
          setGenerating(false);
          setIsCreatingNew(false);
          try {
            sessionStorage.removeItem(ROADMAP_MODE_STORAGE_KEY);
          } catch (e) {}
          return;
        }
      }

    } catch (err) {
      console.warn("Backend API endpoint offline or unreachable. Generating dynamic fallback roadmap.", err);

      // Execute client-side fallback ONLY if Express server is completely offline / unreachable
      const dynamicResult = generateDynamicRoadmap(role, skills, missing);
      const finalDynamicData = {
        ...dynamicResult,
        roadmapId: dynamicResult.roadmapId || newRoadmapId,
        createdAt: timestamp
      };

      saveRoadmap(finalDynamicData);
      clearRoadmapSeed();
      setGenerating(false);
      setIsCreatingNew(false);
      try {
        sessionStorage.removeItem(ROADMAP_MODE_STORAGE_KEY);
      } catch (e) {}
    }
  };

  const handleReset = () => {
    try {
      sessionStorage.setItem(ROADMAP_MODE_STORAGE_KEY, 'create');
    } catch (e) {}

    clearRoadmapSeed();
    setGenerating(false);
    setIsQuotaExceeded(false);
    setIsCreatingNew(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Non-Blocking Guided Journey Banner */}
      <GuidedJourneyBanner currentFeatureId="roadmap" />

      {/* Shared Quota Alert Banner with Retry & Back options */}
      {isQuotaExceeded && (
        <QuotaLimitBanner
          message="The AI service is temporarily unavailable. Please try again in a few minutes."
          onRetry={() => handleGenerateRoadmap(lastFormData)}
          onBack={handleReset}
        />
      )}

      {/* Full-Screen Dedicated AI Reasoning Loading Screen */}
      {generating ? (
        <RoadmapLoadingState targetRole={targetRole} />
      ) : (
        /* Main Roadmap Form vs Generated Roadmap Timeline */
        !activeRoadmap ? (
          <RoadmapForm
            onGenerateRoadmap={handleGenerateRoadmap}
            onGenerate={handleGenerateRoadmap}
            generating={generating}
            roadmapSeed={roadmapSeed}
            isFromJobMatcher={isFromJobMatcher}
            onClearImportedSeed={clearRoadmapSeed}
          />
        ) : (
          <RoadmapTimeline
            roadmapData={activeRoadmap}
            targetRole={targetRole}
            onReset={handleReset}
          />
        )
      )}

    </div>
  );
};
