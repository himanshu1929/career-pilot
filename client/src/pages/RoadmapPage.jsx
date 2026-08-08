import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { RoadmapForm } from '../features/roadmap/RoadmapForm';
import { RoadmapTimeline } from '../features/roadmap/RoadmapTimeline';
import { RoadmapLoadingState } from '../features/roadmap/RoadmapLoadingState';
import { GuidedJourneyBanner } from '../components/layout/GuidedJourneyBanner';
import { QuotaLimitBanner } from '../components/common/QuotaLimitBanner';
import { generateDynamicRoadmap } from '../utils/roadmapGenerator';
import { PageContainer } from '../components/layout/PageContainer';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ROADMAP_MODE_STORAGE_KEY = 'career_pilot_roadmap_mode';

export const RoadmapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    roadmaps, 
    saveRoadmap, 
    roadmapSeed, 
    clearRoadmapSeed,
    activeResumeAnalysis 
  } = useWorkspace();

  const isFromJobMatcher = Boolean(location.state?.fromJobMatcher && roadmapSeed && roadmapSeed.source === 'jobMatcher');

  const [generating, setGenerating] = useState(false);
  const [targetRole, setTargetRole] = useState(roadmapSeed?.targetRole || activeResumeAnalysis?.candidateLevel || '');
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);

  // Mode tracking state
  const [isCreatingNew, setIsCreatingNew] = useState(() => {
    try {
      if (isFromJobMatcher) return true;
      return sessionStorage.getItem(ROADMAP_MODE_STORAGE_KEY) === 'create' || roadmaps.length === 0;
    } catch (e) {
      return false;
    }
  });

  // Keep targetRole in sync when roadmapSeed changes
  useEffect(() => {
    if (roadmapSeed?.targetRole) {
      setTargetRole(roadmapSeed.targetRole);
    }
  }, [roadmapSeed]);

  // Active roadmap selection
  const activeRoadmap = (isCreatingNew || (roadmapSeed && isFromJobMatcher)) ? null : (roadmaps[0] || null);

  const handleGenerateRoadmap = async (formData) => {
    const role = (formData?.targetRole || targetRole || roadmapSeed?.targetRole || activeResumeAnalysis?.candidateLevel || '').trim();
    const skills = (formData?.currentSkills || (Array.isArray(roadmapSeed?.currentSkills) ? roadmapSeed.currentSkills.join(', ') : '') || '').trim();
    const missing = formData?.missingSkills || roadmapSeed?.missingSkills || activeResumeAnalysis?.missingSkills || [];
    const expLevel = formData?.experienceLevel || 'Intermediate';

    // 1. Data Validation
    if (!role || role.length < 2) {
      setErrorMessage("Roadmap generation requires a valid Target Career Role. Please specify your target role.");
      return;
    }

    const payloadInput = {
      targetRole: role,
      currentSkills: skills || 'Programming Fundamentals, Git',
      missingSkills: missing,
      experienceLevel: expLevel,
      timeline: formData?.timeline || '3 months'
    };

    console.log("[ROADMAP] Starting generation", payloadInput);
    setTargetRole(role);
    setLastFormData(formData);
    setGenerating(true);
    setIsQuotaExceeded(false);
    setErrorMessage(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      console.log("[ROADMAP] AI request started");
      const response = await fetch(`${API_URL}/api/roadmap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadInput)
      });

      if (response.status === 429) {
        console.warn("[ROADMAP] AI service rate limited (429)");
        setIsQuotaExceeded(true);
        setGenerating(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log("[ROADMAP] AI response received", json);

      if (json && json.success && json.data) {
        console.log("[ROADMAP] Saving roadmap to Firestore");
        saveRoadmap(json.data);
        console.log("[ROADMAP] Firestore save complete");
        
        clearRoadmapSeed();
        setIsCreatingNew(false);
        try { sessionStorage.setItem(ROADMAP_MODE_STORAGE_KEY, 'view'); } catch (e) {}
      } else {
        throw new Error('Invalid roadmap payload returned by server');
      }

    } catch (err) {
      console.error("[ROADMAP] Generation failed", err);
      console.warn("[ROADMAP] Engaging dynamic client-side fallback generator");

      try {
        const fallbackPayload = generateDynamicRoadmap(role, skills, expLevel, '3 months');
        console.log("[ROADMAP] Saving fallback roadmap to Firestore");
        saveRoadmap(fallbackPayload);
        console.log("[ROADMAP] Firestore save complete");

        clearRoadmapSeed();
        setIsCreatingNew(false);
        try { sessionStorage.setItem(ROADMAP_MODE_STORAGE_KEY, 'view'); } catch (e) {}
      } catch (fallbackErr) {
        console.error("[ROADMAP] Fallback generation also failed", fallbackErr);
        setErrorMessage("Couldn't generate your roadmap. Something went wrong while creating your personalized roadmap.");
      }
    } finally {
      console.log("[ROADMAP] Generation state cleared (generating: false)");
      setGenerating(false);
    }
  };

  const handleReset = () => {
    try { sessionStorage.setItem(ROADMAP_MODE_STORAGE_KEY, 'create'); } catch (e) {}
    setIsCreatingNew(true);
    setIsQuotaExceeded(false);
    setErrorMessage(null);
    clearRoadmapSeed();
  };

  return (
    <PageContainer>
      
      {/* Guided Journey Banner */}
      <GuidedJourneyBanner currentFeatureId="roadmap" />

      {/* Quota Exceeded Alert */}
      {isQuotaExceeded && (
        <QuotaLimitBanner
          message="The AI service is temporarily unavailable. Please try again in a few minutes."
          onRetry={() => handleGenerateRoadmap(lastFormData)}
          onBack={handleReset}
        />
      )}

      {/* Error Alert Card */}
      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-center space-y-4 shadow-xl animate-fadeIn max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-rose-400 font-bold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-base">Couldn't generate your roadmap</span>
          </div>
          <p className="text-xs text-gray-300">
            {errorMessage}
          </p>
          <button
            onClick={() => handleGenerateRoadmap(lastFormData)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* State Machine: Generating Loading vs Form vs Roadmap Timeline */}
      {generating ? (
        <RoadmapLoadingState targetRole={targetRole} />
      ) : (
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

    </PageContainer>
  );
};
