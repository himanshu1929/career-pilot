const STORAGE_KEY = 'career_pilot_resume_history';
const CURRENT_SCHEMA_VERSION = 1;

// SHA-256 Hash helper for PDF files
export async function computeResumeHash(file) {
  if (!file) return `hash_demo_${Date.now()}`;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return `hash_${file.name.replace(/\s+/g, '_')}_${file.size}_${file.lastModified}`;
  }
}

// Helper to format date cleanly as "5 Aug 2026 • 11:45 PM"
export const formatHistoryDate = (isoString) => {
  try {
    const date = isoString ? new Date(isoString) : new Date();
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${day} ${month} ${year} • ${time}`;
  } catch (e) {
    return 'Just now';
  }
};

// Migration Utility for Schema Versions
export const migrateHistoryEntry = (entry) => {
  if (!entry || typeof entry !== 'object') return null;

  try {
    const currentVersion = entry.schemaVersion || 0;

    // Migrate from legacy (v0) to schemaVersion 1
    if (currentVersion < 1) {
      const filename = entry.filename || entry.analysisData?.meta?.originalName || 'Uploaded_Resume.pdf';
      const resumeHash = entry.resumeHash || entry.hash || `hash_${filename.replace(/\s+/g, '_')}_${entry.score || entry.resumeScore || 90}`;
      const uploadedAt = entry.uploadedAt || entry.timestamp || new Date().toISOString();
      const lastUpdated = entry.lastUpdated || entry.timestamp || new Date().toISOString();
      const score = typeof entry.resumeScore === 'number' ? entry.resumeScore : (typeof entry.score === 'number' ? entry.score : 90);
      const atsScore = typeof entry.atsScore === 'number' ? entry.atsScore : 92;

      const analysisObj = entry.analysis || entry.analysisData || {
        score,
        atsScore,
        candidateLevel: entry.candidateLevel || 'Software Engineering Candidate',
        interviewPotential: entry.interviewPotential || 'High Callback Potential',
        atsAssessment: '100% Machine Readable Layout',
        executiveSummary: entry.executiveSummary || 'Resume analyzed successfully.',
        strengths: entry.strengths || ['Strong technical skills'],
        weaknesses: entry.weaknesses || ['No quantified metrics'],
        missingSkills: entry.missingSkills || ['Docker', 'GraphQL'],
        recommendations: entry.recommendations || ['Add metrics to project descriptions.']
      };

      return {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        id: entry.id || `res_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        filename: filename,
        resumeHash: resumeHash,
        uploadedAt: uploadedAt,
        lastUpdated: lastUpdated,
        resumeScore: score,
        atsScore: atsScore,
        scoreDiff: entry.scoreDiff || 0,
        atsDiff: entry.atsDiff || 0,
        statusType: entry.statusType || 'initial',
        oneLineSummary: entry.oneLineSummary || 'Initial resume analysis complete.',
        candidateLevel: analysisObj.candidateLevel || 'Software Engineering Candidate',
        interviewPotential: analysisObj.interviewPotential || 'High Callback Potential',
        executiveSummary: analysisObj.executiveSummary || 'Resume analyzed successfully.',
        versionHistory: entry.versionHistory || [
          {
            versionNum: 1,
            date: formatHistoryDate(uploadedAt).split(' • ')[0],
            score: score,
            atsScore: atsScore,
            filename: filename
          }
        ],
        analysis: analysisObj
      };
    }

    return entry;
  } catch (e) {
    console.error('Failed to migrate history entry:', e);
    return null;
  }
};

// Defensive Validator for History Object Schema v1
export const validateHistoryEntry = (entry) => {
  if (!entry || typeof entry !== 'object') return false;
  
  // Required fields for schema version 1
  const hasRequiredFields = (
    typeof entry.id === 'string' && entry.id.length > 0 &&
    typeof entry.filename === 'string' && entry.filename.length > 0 &&
    typeof entry.resumeHash === 'string' && entry.resumeHash.length > 0 &&
    typeof entry.uploadedAt === 'string' &&
    typeof entry.lastUpdated === 'string' &&
    typeof entry.resumeScore === 'number' &&
    typeof entry.atsScore === 'number' &&
    typeof entry.candidateLevel === 'string' &&
    typeof entry.interviewPotential === 'string' &&
    typeof entry.executiveSummary === 'string' &&
    entry.analysis && typeof entry.analysis === 'object'
  );

  return hasRequiredFields;
};

// Run Storage Self-Healing Pipeline
export const runStorageSelfHealing = () => {
  let rawData = null;
  try {
    rawData = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return getInitialSeedHistory();
  }

  if (!rawData) {
    return getInitialSeedHistory();
  }

  let parsed = null;
  try {
    parsed = JSON.parse(rawData);
  } catch (e) {
    return getInitialSeedHistory();
  }

  if (!Array.isArray(parsed)) {
    return getInitialSeedHistory();
  }

  let migratedCount = 0;
  let purgedCount = 0;
  const validEntries = [];
  const seenHashes = new Set();

  for (const item of parsed) {
    let activeItem = item;

    if (!activeItem.schemaVersion || activeItem.schemaVersion < CURRENT_SCHEMA_VERSION) {
      activeItem = migrateHistoryEntry(activeItem);
      if (activeItem) migratedCount++;
    }

    if (activeItem && validateHistoryEntry(activeItem)) {
      if (!seenHashes.has(activeItem.resumeHash)) {
        seenHashes.add(activeItem.resumeHash);
        validEntries.push(activeItem);
      } else {
        purgedCount++;
      }
    } else {
      purgedCount++;
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validEntries));
  } catch (e) {}

  return validEntries;
};

export const getResumeHistory = () => {
  return runStorageSelfHealing();
};

export const findHistoryByHash = (resumeHash) => {
  if (!resumeHash) return null;
  const history = getResumeHistory();
  return history.find(item => item.resumeHash === resumeHash) || null;
};

const generateOneLineSummary = (scoreDiff, atsDiff, statusType) => {
  if (statusType === 'no_change') {
    return 'No significant content changes detected from previous version.';
  }
  if (statusType === 'decreased') {
    return 'Scores shifted slightly. Review formatting & key technical keywords.';
  }
  if (atsDiff >= 10) {
    return 'Formatting improved significantly with enhanced ATS machine-readability.';
  }
  if (scoreDiff >= 8) {
    return 'Improved keyword coverage, skill tags, and measurable project impact.';
  }
  return 'Added measurable project achievements and refined technical skills.';
};

const getInitialSeedHistory = () => {
  const nowISO = new Date(Date.now() - 3600000 * 2).toISOString();
  const formattedDate = formatHistoryDate(nowISO);
  const seed = [
    {
      schemaVersion: 1,
      id: 'seed_alex_chen_1',
      filename: 'Alex_Chen_Frontend_Resume.pdf',
      resumeHash: 'seed_sha256_hash_v1',
      uploadedAt: nowISO,
      lastUpdated: nowISO,
      resumeScore: 92,
      atsScore: 94,
      scoreDiff: 8,
      atsDiff: 12,
      statusType: 'improved',
      oneLineSummary: 'Improved keyword coverage, Docker tags, and ATS compatibility.',
      candidateLevel: 'Frontend Software Engineer',
      interviewPotential: 'High Callback Potential',
      executiveSummary: 'Your resume demonstrates strong technical depth in React, Vite, and Node.js with clear project impact metrics.',
      versionHistory: [
        {
          versionNum: 1,
          date: '3 Aug 2026',
          score: 84,
          atsScore: 82,
          filename: 'Alex_Chen_Frontend_Resume_v1.pdf'
        },
        {
          versionNum: 2,
          date: '5 Aug 2026',
          score: 92,
          atsScore: 94,
          filename: 'Alex_Chen_Frontend_Resume.pdf'
        }
      ],
      analysis: {
        score: 92,
        atsScore: 94,
        candidateLevel: 'Frontend Software Engineer',
        interviewPotential: 'High Callback Potential',
        atsAssessment: '100% Machine Readable Layout with single-column formatting.',
        executiveSummary: 'Your resume demonstrates strong technical depth in React, Vite, and Node.js with clear project impact metrics.',
        strengths: [
          'Strong technical skills depth in React and TypeScript',
          'Clean single-column layout with high ATS parser readability',
          'Clear project achievements with performance metrics'
        ],
        weaknesses: [
          'No quantified performance metrics on recent work',
          'Missing cloud infrastructure & deployment keywords'
        ],
        missingSkills: ['Docker', 'AWS', 'CI/CD (GitHub Actions)', 'Next.js App Router'],
        recommendations: [
          'Add a dedicated "DevOps & Deployment" section highlighting Docker and Railway/Vercel experience.',
          'Include direct GitHub repository & live demo links for your top 3 projects.'
        ],
        meta: {
          originalName: 'Alex_Chen_Frontend_Resume.pdf',
          sizeFormatted: '1.42 MB',
          wordCount: 420
        }
      }
    }
  ];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  } catch (e) {}
  return seed;
};

export const saveResumeAnalysisToHistory = (analysisData, filenameOverride = null) => {
  const history = getResumeHistory();
  const filename = filenameOverride || analysisData?.meta?.originalName || 'Uploaded_Resume.pdf';
  const resumeHash = analysisData.contentHash || analysisData.resumeHash || `hash_${filename.replace(/\s+/g, '_')}_${analysisData.score}`;
  const nowISO = new Date().toISOString();
  const formattedDate = formatHistoryDate(nowISO);

  const existingIndex = history.findIndex(
    item => item.resumeHash === resumeHash || item.filename.toLowerCase().trim() === filename.toLowerCase().trim()
  );

  const existingEntry = existingIndex >= 0 ? history[existingIndex] : null;

  if (existingEntry && existingEntry.resumeHash === resumeHash) {
    existingEntry.lastUpdated = nowISO;
    existingEntry.statusType = 'no_change';
    existingEntry.oneLineSummary = 'No significant content changes detected.';
    
    history.splice(existingIndex, 1);
    history.unshift(existingEntry);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {}

    return history;
  }

  const prevScore = existingEntry ? existingEntry.resumeScore : null;
  const prevAts = existingEntry ? existingEntry.atsScore : null;

  const currentScore = typeof analysisData.score === 'number' ? analysisData.score : 88;
  const currentAts = typeof analysisData.atsScore === 'number' ? analysisData.atsScore : 90;

  const scoreDiff = prevScore !== null ? currentScore - prevScore : 0;
  const atsDiff = prevAts !== null ? currentAts - prevAts : 0;

  let statusType = 'initial';
  if (prevScore !== null) {
    if (scoreDiff === 0 && atsDiff === 0) statusType = 'no_change';
    else if (scoreDiff > 0 || atsDiff > 0) statusType = 'improved';
    else if (scoreDiff < 0 || atsDiff < 0) statusType = 'decreased';
  }

  const oneLineSummary = prevScore !== null 
    ? generateOneLineSummary(scoreDiff, atsDiff, statusType)
    : 'Initial resume analysis complete.';

  const previousVersions = existingEntry?.versionHistory || [];
  if (previousVersions.length === 0 && prevScore !== null) {
    previousVersions.push({
      versionNum: 1,
      date: formatHistoryDate(existingEntry.uploadedAt || nowISO).split(' • ')[0],
      score: prevScore,
      atsScore: prevAts,
      filename: existingEntry.filename
    });
  }

  const newVersionNum = previousVersions.length + 1;
  const updatedVersions = [
    ...previousVersions,
    {
      versionNum: newVersionNum,
      date: formattedDate.split(' • ')[0],
      score: currentScore,
      atsScore: currentAts,
      filename: filename
    }
  ];

  const newEntry = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    id: existingEntry ? existingEntry.id : `res_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    filename: filename,
    resumeHash: resumeHash,
    uploadedAt: existingEntry ? existingEntry.uploadedAt : nowISO,
    lastUpdated: nowISO,
    resumeScore: currentScore,
    atsScore: currentAts,
    scoreDiff: scoreDiff,
    atsDiff: atsDiff,
    statusType: statusType,
    oneLineSummary: oneLineSummary,
    candidateLevel: analysisData.candidateLevel || 'Software Engineering Candidate',
    interviewPotential: analysisData.interviewPotential || 'High Callback Potential',
    executiveSummary: analysisData.executiveSummary || 'Resume analyzed successfully.',
    versionHistory: updatedVersions,
    analysis: {
      ...analysisData,
      formattedDate: formattedDate
    }
  };

  if (existingIndex >= 0) {
    history.splice(existingIndex, 1);
  }

  history.unshift(newEntry);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history to localStorage:', e);
  }

  return history;
};

export const deleteResumeHistoryItem = (id) => {
  const history = getResumeHistory();
  const filtered = history.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {}
  return filtered;
};

export const clearAllResumeHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  return [];
};
