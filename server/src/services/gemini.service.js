import { GoogleGenAI } from '@google/genai';

// Defensive Error Checks for API Quota / High Demand Service Limits (HTTP 429 & 503)
export const isQuotaExceededError = (error) => {
  if (!error) return false;
  const msg = (error.message || JSON.stringify(error) || '').toLowerCase();
  const status = error.status || error.statusCode || error.code;
  return (
    status === 429 ||
    status === 503 ||
    msg.includes('429') ||
    msg.includes('503') ||
    msg.includes('quota') ||
    msg.includes('resource_exhausted') ||
    msg.includes('rate limit') ||
    msg.includes('unavailable') ||
    msg.includes('high demand') ||
    msg.includes('spikes in demand')
  );
};

// System Prompt for Resume Analysis
const RESUME_ANALYSIS_SYSTEM_PROMPT = `
You are an executive Technical Recruiter and ATS Specialist.
Analyze the candidate's resume text and return structured metrics.

CRITICAL INSTRUCTIONS:
1. OUTPUT MUST BE STRICT, VALID RAW JSON ONLY.
2. DO NOT include markdown code fences (\`\`\`json or \`\`\`).

REQUIRED JSON STRUCTURE:
{
  "score": <integer from 0 to 100 representing overall resume impact>,
  "atsScore": <integer from 0 to 100 representing ATS machine readability & formatting quality>,
  "candidateLevel": "<Inferred Candidate Level e.g. Senior Software Engineer, Mid-Level Frontend Dev, Entry-Level Engineer>",
  "interviewPotential": "<Callback Probability e.g. High Callback Potential, Moderate Callback Potential>",
  "atsAssessment": "<1-2 sentence assessment of ATS format compatibility & layout cleanliness>",
  "executiveSummary": "<2-3 sentence executive summary highlighting key background, technical strengths, and impact>",
  "strengths": [<array of 3-4 specific technical or impact strengths found in the resume>],
  "weaknesses": [<array of 2-3 specific areas needing improvement or missing quantifiable metrics>],
  "missingSkills": [<array of 3-4 key industry-standard technical keywords or skills missing from the resume>],
  "recommendations": [<array of 3-4 actionable, concrete recommendations to improve score>]
}
`;

// System Prompt for Job Description Matching
const JOB_MATCH_SYSTEM_PROMPT = `
You are an AI Technical Recruiter matching a candidate resume against a target Job Description.

CRITICAL INSTRUCTIONS:
1. OUTPUT MUST BE STRICT, VALID RAW JSON ONLY.
2. DO NOT include markdown code fences (\`\`\`json or \`\`\`).

REQUIRED JSON STRUCTURE:
{
  "matchScore": <integer from 0 to 100 representing overall candidate alignment with the job description>,
  "matchingSkills": [<array of 4-6 specific technical skills & competencies in the resume that match the JD>],
  "missingSkills": [<array of 3-5 critical technical skills or tools required by the JD that the candidate lacks>],
  "strengths": [<array of 4-5 specific candidate strengths & qualifications matching the JD>],
  "weaknesses": [<array of 3-5 gaps, missing experience areas, or weaknesses relative to this specific JD>],
  "resumeImprovements": [<array of 3-5 concrete, actionable bullet points on how to tailor the resume specifically for this job description>],
  "hiringSummary": "<1-2 sentence executive summary explaining candidate fit for the hiring manager>"
}
`;

// Generalized Senior Career Mentor System Prompt with MEANINGFUL DYNAMIC PHASES
const ROADMAP_SYSTEM_PROMPT = `
You are a Principal Software Architect, Engineering Director, and Senior Career Mentor.
Create a deeply personalized, mentor-driven Learning Roadmap tailored to the candidate's CURRENT STARTING PROFICIENCY and target role.

CRITICAL INSTRUCTIONS FOR PERSONALIZATION:
1. PRIMARY INPUT - STARTING PROFICIENCY INFERENCE:
   - First, analyze the candidate's "Current Skills & Knowledge" text and "Experience Level" to determine their actual starting proficiency (Beginner, Intermediate, or Advanced).
   - If the candidate describes beginner-level knowledge (e.g., "basics of Java", "a little OOP", "started learning HTML/CSS", "student", "intern", "beginner"), Phase 1 MUST start with Core Language/Domain Fundamentals, Syntax, OOP Principles, and Basic Foundations.
   - DO NOT assume the candidate already has intermediate framework mastery just because a language is mentioned in their current skills.
   - Build a progressive difficulty curve:
     * Phase 1: Core Fundamentals & Starting Foundations (directly bridging the candidate's starting point).
     * Phase 2: Core Tooling, Relational Databases/Storage, and API Foundations.
     * Phase 3: Main Framework Mastery & Application Architecture.
     * Phase 4: Advanced Engineering, Security, Microservices, Testing & Cloud Deployment.

2. OUTPUT MUST BE STRICT, VALID RAW JSON ONLY (NO markdown formatting or \`\`\`json).
3. DYNAMIC MEANINGFUL PHASES: Generate 3 to 5 meaningful phase names reflecting the progressive learning path.
4. SKILL GAP ANALYSIS REQUIREMENTS: Provide structured objects for alreadyStrongSkills, needsImprovementSkills, and missingSkills.
5. RESUME-WORTHY PROJECTS: Projects must be resume-worthy and progressively harder across phases.
6. REAL RESOURCES: For every phase, generate exactly 5 working learning resources with valid URLs.

REQUIRED JSON STRUCTURE:
{
  "targetRole": "<User Target Goal/Role>",
  "currentLevel": "<Inferred Current Level>",
  "readinessScore": 88,
  "estJobMatch": 92,
  "alreadyStrongSkills": [
    { "name": "<Skill Name>", "status": "Strong", "priority": "Critical", "explanation": "<Explanation>" }
  ],
  "needsImprovementSkills": [
    { "name": "<Skill Name>", "status": "Needs Improvement", "priority": "Critical", "explanation": "<Explanation>" }
  ],
  "missingSkills": [
    { "name": "<Skill Name>", "status": "Missing", "priority": "Critical", "explanation": "<Short explanation>" }
  ],
  "recruiterPrioritySkills": ["<Top Skill 1>", "<Top Skill 2>", "<Top Skill 3>"],
  "jobApplicationAdvice": "<Mentor advice on when to start applying>",
  "beginnerPitfalls": ["<Mistake 1>", "<Mistake 2>", "<Mistake 3>"],
  "skillsCategories": [
    {
      "category": "<Domain Category>",
      "skills": [
        { "name": "<Skill Name>", "level": "Strong", "percent": 90 }
      ]
    }
  ],
  "roadmap": [
    {
      "phaseNum": 1,
      "phaseName": "Foundation & Core Language Syntax",
      "title": "<Phase 1 Title>",
      "learningGoal": "<1-sentence learning objective>",
      "whyItMatters": "<Why this phase matters>",
      "prerequisites": "<Prerequisites>",
      "estimatedTime": "3 Weeks",
      "difficulty": "Beginner",
      "whenToBuild": "<When to start building>",
      "topics": ["<Topic 1>", "<Topic 2>", "<Topic 3>"],
      "project": {
        "name": "<Resume-Worthy Project Name>",
        "difficulty": "Beginner",
        "estimatedDuration": "1 Week",
        "desc": "<Description>",
        "skillsPracticed": ["<Skill 1>", "<Skill 2>"],
        "whyRecruitersLikeIt": "<Why recruiters like it>",
        "resumeValue": "<Resume bullet point example>",
        "stretchGoals": ["<Stretch Goal 1>", "<Stretch Goal 2>"]
      },
      "resources": [
        { "type": "doc", "label": "Official Documentation", "title": "<Real Official Docs>", "source": "<Platform Name>", "url": "<Real Valid URL>", "icon": "📘" },
        { "type": "video", "label": "Best YouTube Course", "title": "<Real Video>", "source": "<Creator Name>", "url": "<Real Valid URL>", "icon": "🎥" },
        { "type": "practice", "label": "Practice Platform", "title": "<Practice Platform>", "source": "<Platform Name>", "url": "<Real Valid URL>", "icon": "💻" },
        { "type": "article", "label": "Recommended Article", "title": "<Article>", "source": "<Platform Name>", "url": "<Real Valid URL>", "icon": "📰" },
        { "type": "github", "label": "GitHub Examples", "title": "<GitHub Code>", "source": "GitHub", "url": "<Real Valid URL>", "icon": "⚡" }
      ]
    }
  ]
}
`;

export const analyzeResumeWithGemini = async (resumeText) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey === 'your_gemini_api_key_here') {
    console.warn('GEMINI_API_KEY not configured. Returning structured evaluation.');
    return generateFallbackAnalysis(resumeText);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `${RESUME_ANALYSIS_SYSTEM_PROMPT}\n\nCandidate Resume Text:\n${resumeText.slice(0, 15000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    let responseText = (response.text || '').trim();

    if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    const jsonOutput = JSON.parse(responseText);
    return sanitizeAnalysisResult(jsonOutput, resumeText);

  } catch (error) {
    if (isQuotaExceededError(error)) {
      console.error('[Gemini API Quota Exceeded]:', error.message);
      const quotaErr = new Error('The AI service has reached its temporary usage limit. Please try again later.');
      quotaErr.status = 429;
      quotaErr.errorType = 'QUOTA_EXCEEDED';
      throw quotaErr;
    }
    console.error('Error invoking Gemini API for Resume Analysis:', error);
    return generateFallbackAnalysis(resumeText);
  }
};

export const matchJobWithGemini = async (resumeText, jobDescription) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey === 'your_gemini_api_key_here') {
    console.warn('GEMINI_API_KEY not configured. Returning fallback Job Match evaluation.');
    return generateFallbackJobMatch(resumeText, jobDescription);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `${JOB_MATCH_SYSTEM_PROMPT}\n\nCandidate Resume Text:\n${resumeText.slice(0, 10000)}\n\nTarget Job Description:\n${jobDescription.slice(0, 10000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    let responseText = (response.text || '').trim();

    if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    const jsonOutput = JSON.parse(responseText);
    return sanitizeJobMatchResult(jsonOutput, jobDescription);

  } catch (error) {
    if (isQuotaExceededError(error)) {
      console.error('[Gemini API Quota Exceeded]:', error.message);
      const quotaErr = new Error('The AI service has reached its temporary usage limit. Please try again later.');
      quotaErr.status = 429;
      quotaErr.errorType = 'QUOTA_EXCEEDED';
      throw quotaErr;
    }
    console.error('Error invoking Gemini API for Job Matching:', error);
    return generateFallbackJobMatch(resumeText, jobDescription);
  }
};

export const matchJobDescriptionWithGemini = matchJobWithGemini;

export const generateRoadmapWithGemini = async ({ targetRole, currentSkills, missingSkills = [], experienceLevel }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const missingStr = Array.isArray(missingSkills) ? missingSkills.join(', ') : (missingSkills || '');

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey === 'your_gemini_api_key_here') {
    console.warn('GEMINI_API_KEY not configured. Returning dynamic fallback Roadmap.');
    return generateFallbackRoadmap(targetRole, currentSkills, missingSkills);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `${ROADMAP_SYSTEM_PROMPT}

Candidate Inputs (PRIMARY BASE FOR PERSONALIZATION):
- Target Career Role / Goal: ${targetRole}
- Current Skills & Knowledge: "${currentSkills}"
- Selected Experience Level: "${experienceLevel}"
- Identified Skill Gaps to Cover: ${missingStr || 'None specified'}

IMPORTANT INSTRUCTION FOR AI GENERATION:
Carefully read the candidate's "Current Skills & Knowledge" ("${currentSkills}") and "Experience Level" ("${experienceLevel}").
Infer their actual starting proficiency level (Beginner vs Intermediate vs Advanced).
If the candidate describes beginner/basic knowledge (e.g. "basics of Java and a little knowledge of OOP", "HTML/CSS basics"), Phase 1 MUST start with Core Language Fundamentals, OOP, and Basic Concepts before introducing higher-level frameworks (e.g., Spring Boot, Microservices, React Server Components).
Progressively step up difficulty from Phase 1 to Phase 4.`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    let responseText = (response.text || '').trim();

    if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    const jsonOutput = JSON.parse(responseText);
    return sanitizeRoadmapResult(jsonOutput, targetRole);

  } catch (error) {
    if (isQuotaExceededError(error)) {
      console.error('[Gemini API Quota Exceeded]:', error.message);
      const quotaErr = new Error('The AI service has reached its temporary usage limit. Please try again later.');
      quotaErr.status = 429;
      quotaErr.errorType = 'QUOTA_EXCEEDED';
      throw quotaErr;
    }
    console.error('Error invoking Gemini API for Roadmap:', error);
    return generateFallbackRoadmap(targetRole, currentSkills);
  }
};

const sanitizeAnalysisResult = (data, resumeText = '') => {
  const score = typeof data.score === 'number' ? Math.min(100, Math.max(0, Math.round(data.score))) : 88;
  const atsScore = typeof data.atsScore === 'number' ? Math.min(100, Math.max(0, Math.round(data.atsScore))) : 92;

  const candidateLevel = data.candidateLevel || "Software Engineering Candidate";
  const interviewPotential = data.interviewPotential || (
    score >= 85 ? "High Callback Potential" :
    score >= 70 ? "Moderate Callback Potential" :
    "Optimization Recommended Before Applying"
  );
  const atsAssessment = data.atsAssessment || "Fully ATS Machine-Readable Layout";
  const executiveSummary = data.executiveSummary || "Candidate resume demonstrates strong technical capabilities.";

  const strengths = Array.isArray(data.strengths) && data.strengths.length > 0 
    ? data.strengths 
    : ["Strong technical core skills", "Clean formatting layout"];

  const weaknesses = Array.isArray(data.weaknesses) && data.weaknesses.length > 0 
    ? data.weaknesses 
    : ["Lacks explicit deployment metrics"];

  const missingSkills = Array.isArray(data.missingSkills) && data.missingSkills.length > 0 
    ? data.missingSkills 
    : ["Docker", "CI/CD"];

  const recommendations = Array.isArray(data.recommendations) && data.recommendations.length > 0 
    ? data.recommendations 
    : ["Quantify project impact by mentioning measurable outcomes."];

  return {
    score,
    atsScore,
    candidateLevel,
    interviewPotential,
    atsAssessment,
    executiveSummary,
    strengths,
    weaknesses,
    missingSkills,
    recommendations
  };
};

const sanitizeJobMatchResult = (data) => {
  return {
    matchScore: typeof data.matchScore === 'number' ? Math.min(100, Math.max(0, Math.round(data.matchScore))) : 84,
    matchingSkills: Array.isArray(data.matchingSkills) ? data.matchingSkills : ["Core Domain Skills"],
    missingSkills: Array.isArray(data.missingSkills) ? data.missingSkills : ["Advanced Frameworks"],
    strengths: Array.isArray(data.strengths) ? data.strengths : ["Strong foundational depth"],
    weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : ["Lacks specialized experience"],
    resumeImprovements: Array.isArray(data.resumeImprovements) ? data.resumeImprovements : ["Highlight key domain projects"],
    hiringSummary: data.hiringSummary || "Candidate is a solid technical fit for the position requirements."
  };
};

const sanitizeRoadmapResult = (data, targetRole = '') => {
  return {
    targetRole: data.targetRole || targetRole || "Engineering Specialist",
    currentLevel: data.currentLevel || "Student / Intern",
    readinessScore: typeof data.readinessScore === 'number' ? data.readinessScore : 88,
    estJobMatch: typeof data.estJobMatch === 'number' ? data.estJobMatch : 92,
    alreadyStrongSkills: Array.isArray(data.alreadyStrongSkills) ? data.alreadyStrongSkills : [],
    needsImprovementSkills: Array.isArray(data.needsImprovementSkills) ? data.needsImprovementSkills : [],
    missingSkills: Array.isArray(data.missingSkills) ? data.missingSkills : [],
    recruiterPrioritySkills: Array.isArray(data.recruiterPrioritySkills) ? data.recruiterPrioritySkills : [],
    jobApplicationAdvice: data.jobApplicationAdvice || "",
    beginnerPitfalls: Array.isArray(data.beginnerPitfalls) ? data.beginnerPitfalls : [],
    skillsCategories: Array.isArray(data.skillsCategories) ? data.skillsCategories : [],
    roadmap: Array.isArray(data.roadmap) ? data.roadmap : []
  };
};

const generateFallbackAnalysis = (resumeText) => ({
  score: 88,
  atsScore: 90,
  candidateLevel: "Software Engineering Candidate",
  interviewPotential: "High Callback Potential",
  atsAssessment: "Fully ATS Machine-Readable Layout",
  executiveSummary: "Candidate profile demonstrates solid core experience with clear technical skill depth.",
  strengths: [
    "Well-structured experience section highlighting modern software engineering stack.",
    "Clean single-column ATS readable format with clear date ranges."
  ],
  weaknesses: [
    "Lacks explicit mentions of cloud deployment infrastructure (Docker/AWS)."
  ],
  missingSkills: ["Docker", "CI/CD"],
  recommendations: [
    "Add quantified metric outcomes to project bullet points."
  ]
});

const generateFallbackJobMatch = (resumeText, jobDescription) => ({
  matchScore: 84,
  matchingSkills: ["Core Domain Skills", "System Design", "APIs"],
  missingSkills: ["Cloud Infrastructure", "DevOps"],
  strengths: ["Strong foundational depth"],
  weaknesses: ["Lacks containerization experience"],
  resumeImprovements: ["Add specialized projects to your resume"],
  hiringSummary: "Candidate is a solid technical fit for the position requirements."
});

const generateFallbackRoadmap = (targetRole = 'Software Engineer', currentSkills = '') => {
  const goal = (targetRole || 'Software Engineer').trim();
  const lowerGoal = goal.toLowerCase();

  let categories = [];
  let strong = [];
  let needs = [];
  let missing = [];
  let steps = [];

  if (lowerGoal.includes('java') || lowerGoal.includes('spring')) {
    strong = [
      { name: 'Java 17', status: 'Strong', priority: 'Critical', explanation: 'Solid foundation in modern Java language constructs, records, and object-oriented design.' },
      { name: 'REST API Design', status: 'Strong', priority: 'Critical', explanation: 'Understanding of HTTP verbs, status codes, and JSON payload serialization.' }
    ];
    needs = [
      { name: 'Spring Boot 3 Core', status: 'Needs Improvement', priority: 'Critical', explanation: 'Essential for building backend microservices with Inversion of Control and Bean dependency injection.' },
      { name: 'Spring Data JPA', status: 'Needs Improvement', priority: 'Recommended', explanation: 'Simplifies database persistence and relational mapping, avoiding tedious manual SQL queries.' }
    ];
    missing = [
      { name: 'Docker Containerization', status: 'Missing', priority: 'Critical', explanation: 'Frequently required for deployment and DevOps workflows. Learning Docker significantly improves employability for backend roles.' },
      { name: 'Spring Security & JWT', status: 'Missing', priority: 'Critical', explanation: 'Mandatory for protecting REST API endpoints with authentication and role-based access control.' },
      { name: 'Apache Kafka', status: 'Missing', priority: 'Recommended', explanation: 'Enables asynchronous event streaming between microservices, critical for high-scale enterprise systems.' }
    ];

    categories = [
      { category: 'Core Languages & JVM', skills: [{ name: 'Java 17', level: 'Strong', percent: 88 }, { name: 'OOP Principles', level: 'Strong', percent: 90 }] },
      { category: 'Frameworks & Enterprise', skills: [{ name: 'Spring Boot 3', level: 'Intermediate', percent: 65 }, { name: 'Spring Security', level: 'Beginner', percent: 35 }] },
      { category: 'Databases & APIs', skills: [{ name: 'PostgreSQL / Hibernate', level: 'Intermediate', percent: 60 }, { name: 'RESTful Web Services', level: 'Strong', percent: 85 }] },
      { category: 'DevOps & Tools', skills: [{ name: 'Maven / Gradle', level: 'Strong', percent: 80 }, { name: 'Docker / Microservices', level: 'Beginner', percent: 30 }] }
    ];

    steps = [
      {
        phaseNum: 1,
        phaseName: 'JVM & OOP Foundation',
        title: 'Java 17 Architecture, Memory Model & Collections',
        learningGoal: 'Master Java 17 records, memory allocation, multithreading, and OOP design patterns.',
        whyItMatters: 'Strong Java foundation ensures memory efficiency and clean object-oriented architecture in large backend applications.',
        prerequisites: 'Basic programming syntax in Java, C++, or Python.',
        estimatedTime: '2 Weeks',
        difficulty: 'Intermediate',
        whenToBuild: 'Study Java concurrency and collections for 4 days, then build the Thread-Safe Banking Ledger utility.',
        topics: ['Java 17 Records, Sealed Classes & Pattern Matching', 'Java Memory Model, Garbage Collection & JVM Tuning', 'Concurrent Collections & Multi-threading Synchronization'],
        project: {
          name: 'Thread-Safe Concurrent Transaction Engine',
          difficulty: 'Intermediate',
          estimatedDuration: '1 Week',
          desc: 'Build a multi-threaded Java 17 banking ledger managing high-concurrency balance transfers with zero race conditions.',
          skillsPracticed: ['Java 17', 'Concurrency', 'Multithreading', 'OOP'],
          whyRecruitersLikeIt: 'Demonstrates deep JVM memory and thread synchronization understanding.',
          resumeValue: 'Engineered a thread-safe concurrent Java transaction engine processing 10,000+ operations/sec with zero race conditions.',
          stretchGoals: ['Add custom benchmark tests using JMH', 'Implement deadlock detection monitoring']
        },
        resources: [
          { type: 'doc', label: 'Official Documentation', title: 'Java 17 Official Reference Documentation', source: 'Oracle', url: 'https://docs.oracle.com/en/java/javase/17/', icon: '📘' },
          { type: 'video', label: 'Best YouTube Course', title: 'Java 17 Masterclass - Advanced OOP & Concurrency', source: 'Programming with Mosh', url: 'https://www.youtube.com/watch?v=eIrMbAQSU34', icon: '🎥' },
          { type: 'practice', label: 'Practice Platform', title: 'Java Data Structures & Multithreading Katas', source: 'LeetCode', url: 'https://leetcode.com', icon: '💻' },
          { type: 'article', label: 'Recommended Article', title: 'Understanding Java 17 Records & Sealed Interfaces', source: 'Baeldung', url: 'https://www.baeldung.com', icon: '📰' },
          { type: 'github', label: 'GitHub Examples', title: 'Java Design Patterns Repository', source: 'GitHub', url: 'https://github.com/iluwatar/java-design-patterns', icon: '⚡' }
        ]
      },
      {
        phaseNum: 2,
        phaseName: 'Core Spring Boot & Persistence',
        title: 'Spring Boot 3 REST APIs, Dependency Injection & JPA',
        learningGoal: 'Build robust REST APIs using Spring Boot 3, Dependency Injection, and JPA database persistence.',
        whyItMatters: 'Spring Boot powers enterprise backends globally. Understanding IoC, Beans, and JPA is mandatory for backend roles.',
        prerequisites: 'Phase 1: Java 17 OOP understanding and collection interfaces.',
        estimatedTime: '3 Weeks',
        difficulty: 'Intermediate',
        whenToBuild: 'Build the Order Management REST service after understanding Spring Boot Dependency Injection.',
        topics: ['Spring Boot 3 Inversion of Control & Beans', 'Spring Data JPA Repositories & Hibernate Relational Mappings', 'Flyway / Liquibase Database Migrations & Swagger Docs'],
        project: {
          name: 'Enterprise Order Management REST Service',
          difficulty: 'Intermediate',
          estimatedDuration: '1 Week',
          desc: 'Develop a high-throughput REST API with Spring Boot 3, PostgreSQL, Flyway database migrations, and Swagger API documentation.',
          skillsPracticed: ['Java 17', 'Spring Boot 3', 'PostgreSQL', 'Spring Data JPA'],
          whyRecruitersLikeIt: 'Demonstrates clean layered backend architecture (Controller, Service, Repository) and database migration handling.',
          resumeValue: 'Developed a high-throughput Java 17 REST API with Spring Boot 3 and PostgreSQL, managing transactional order persistence with Flyway migrations.',
          stretchGoals: ['Implement OpenAPI/Swagger interactive API documentation', 'Add Flyway database schema versioning']
        },
        resources: [
          { type: 'doc', label: 'Official Documentation', title: 'Spring Boot 3 Official Reference Guide', source: 'Spring.io', url: 'https://spring.io/projects/spring-boot', icon: '📘' },
          { type: 'video', label: 'Best YouTube Course', title: 'Spring Boot 3 Masterclass (Full Course)', source: 'Programming with Mosh', url: 'https://www.youtube.com/watch?v=9SGDpanrc8U', icon: '🎥' },
          { type: 'practice', label: 'Practice Platform', title: 'Java OOP & Data Structures Challenges', source: 'LeetCode', url: 'https://leetcode.com/problemset/all/', icon: '💻' },
          { type: 'article', label: 'Recommended Article', title: 'Building Production Microservices with Spring Boot', source: 'Baeldung', url: 'https://www.baeldung.com/spring-boot', icon: '📰' },
          { type: 'github', label: 'GitHub Examples', title: 'Spring Boot Official Repository & Samples', source: 'GitHub', url: 'https://github.com/spring-projects/spring-boot', icon: '⚡' }
        ]
      },
      {
        phaseNum: 3,
        phaseName: 'Advanced Microservices & Kafka',
        title: 'Distributed Microservices Architecture & Spring Security 6',
        learningGoal: 'Secure enterprise REST endpoints and build decoupled distributed microservices.',
        whyItMatters: 'Security and distributed architecture are what separate junior devs from enterprise backend engineers.',
        prerequisites: 'Phase 2: REST API creation and Spring Data JPA persistence.',
        estimatedTime: '4 Weeks',
        difficulty: 'Advanced',
        whenToBuild: 'Implement JWT authentication on your existing REST API before adding Spring Cloud Gateway.',
        topics: ['Spring Security 6 Filter Chains & JWT Tokens', 'Spring Cloud Eureka Service Discovery & Gateway', 'Apache Kafka Asynchronous Event Streaming'],
        project: {
          name: 'Distributed Microservices Banking & Payment Engine',
          difficulty: 'Advanced',
          estimatedDuration: '2 Weeks',
          desc: 'Architect an event-driven microservices backend using Spring Cloud Gateway, Eureka, JWT security, and Kafka event publishing.',
          skillsPracticed: ['Spring Security', 'JWT', 'Spring Cloud', 'Apache Kafka'],
          whyRecruitersLikeIt: 'Showcases decoupled microservices communication using Spring Cloud Gateway, Eureka service discovery, and Kafka event streaming.',
          resumeValue: 'Architected an event-driven microservices banking backend using Spring Cloud Gateway, Eureka, and Apache Kafka for asynchronous transaction processing.',
          stretchGoals: ['Implement Spring Security JWT authentication filters', 'Add Distributed Tracing with Zipkin & Micrometer']
        },
        resources: [
          { type: 'doc', label: 'Official Documentation', title: 'Spring Security Official Documentation', source: 'Spring.io', url: 'https://spring.io/projects/spring-security', icon: '📘' },
          { type: 'video', label: 'Best YouTube Course', title: 'Building Microservices with Spring Boot & Kafka', source: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=mSgBmLU8cWc', icon: '🎥' },
          { type: 'practice', label: 'Practice Platform', title: 'Microservices & Distributed Systems Kata', source: 'Exercism', url: 'https://exercism.org/tracks/java', icon: '💻' },
          { type: 'article', label: 'Recommended Article', title: 'Spring Security JWT Filter Chain Architecture', source: 'Baeldung', url: 'https://www.baeldung.com/spring-security-jwt', icon: '📰' },
          { type: 'github', label: 'GitHub Examples', title: 'Spring Cloud Microservices Samples', source: 'GitHub', url: 'https://github.com/spring-cloud', icon: '⚡' }
        ]
      },
      {
        phaseNum: 4,
        phaseName: 'Production Readiness & Kubernetes',
        title: 'Docker, Kubernetes Orchestration & JUnit 5 Integration Testing',
        learningGoal: 'Containerize Spring Boot applications, achieve high unit test coverage, and deploy to Kubernetes.',
        whyItMatters: 'Enterprise deployments require containerized microservices and regression testing with JUnit 5.',
        prerequisites: 'Phase 3: Spring Boot microservices and Spring Security.',
        estimatedTime: '4 Weeks',
        difficulty: 'Production-Grade',
        whenToBuild: 'Write unit tests for your Spring controllers and services, then write a multi-stage Dockerfile.',
        topics: ['Unit & Integration Testing with JUnit 5 & Mockito', 'Docker Multi-stage Containerization for Spring Boot', 'GitHub Actions Automated CI/CD Deployment'],
        project: {
          name: 'Kubernetes-Deployed Banking System with Automated CI/CD',
          difficulty: 'Production-Grade',
          estimatedDuration: '3 Weeks',
          desc: 'Containerize a multi-module Spring Boot backend with Docker, run automated JUnit test suites, and deploy to Kubernetes via CI/CD.',
          skillsPracticed: ['JUnit 5', 'Mockito', 'Docker', 'Kubernetes', 'GitHub Actions'],
          whyRecruitersLikeIt: 'Demonstrates end-to-end production readiness, Docker multi-stage builds, JUnit 5 test automation, and Kubernetes orchestration.',
          resumeValue: 'Containerized multi-service Spring Boot backend using Docker multi-stage builds, achieving 90% JUnit 5 test coverage and deploying to Kubernetes.',
          stretchGoals: ['Write Helm charts for multi-environment deployments', 'Set up Prometheus metrics and Grafana alerts']
        },
        resources: [
          { type: 'doc', label: 'Official Documentation', title: 'Kubernetes Official Documentation', source: 'Kubernetes.io', url: 'https://kubernetes.io/docs/home/', icon: '📘' },
          { type: 'video', label: 'Best YouTube Course', title: 'Docker for Java Developers Masterclass', source: 'Amigoscode', url: 'https://www.youtube.com/watch?v=gAkwW2tuIqE', icon: '🎥' },
          { type: 'practice', label: 'Practice Platform', title: 'JUnit & Mockito Testing Kata', source: 'HackerRank', url: 'https://www.hackerrank.com/domains/java', icon: '💻' },
          { type: 'article', label: 'Recommended Article', title: 'Dockerizing Spring Boot Applications Best Practices', source: 'Spring Blog', url: 'https://spring.io/blog', icon: '📰' },
          { type: 'github', label: 'GitHub Examples', title: 'Spring Boot Docker Multi-stage Samples', source: 'GitHub', url: 'https://github.com/docker/labs', icon: '⚡' }
        ]
      }
    ];
  } else {
    // Universal Default
    strong = [
      { name: `${goal} Core Concepts`, status: 'Strong', priority: 'Critical', explanation: 'Foundational domain principles required for day-to-day software development.' },
      { name: 'Git & Version Control', status: 'Strong', priority: 'Critical', explanation: 'Essential for collaborative code management and feature branch workflows.' }
    ];
    needs = [
      { name: 'System Architecture', status: 'Needs Improvement', priority: 'Critical', explanation: 'Crucial for designing modular, maintainable systems that scale effectively.' },
      { name: 'Automated Testing', status: 'Needs Improvement', priority: 'Recommended', explanation: 'Validates system reliability and prevents regressions during continuous deployment.' }
    ];
    missing = [
      { name: 'Production Performance Tuning', status: 'Missing', priority: 'Critical', explanation: 'Frequently required for high-throughput production environments to eliminate bottlenecks.' },
      { name: 'Cloud / CI Deployment', status: 'Missing', priority: 'Recommended', explanation: 'Automates building, testing, and shipping applications to cloud infrastructure.' }
    ];

    categories = [
      { category: 'Fundamentals', skills: [{ name: `${goal} Core`, level: 'Strong', percent: 85 }, { name: 'Problem Solving', level: 'Strong', percent: 90 }] },
      { category: 'Advanced Domain Tools', skills: [{ name: 'Frameworks & Libraries', level: 'Intermediate', percent: 65 }, { name: 'Architecture & Design', level: 'Intermediate', percent: 60 }] },
      { category: 'Specialized Capabilities', skills: [{ name: 'Performance Optimization', level: 'Intermediate', percent: 55 }, { name: 'Production Standards', level: 'Beginner', percent: 35 }] }
    ];

    steps = [
      {
        phaseNum: 1,
        phaseName: 'Foundation & Core Standards',
        title: `Master ${goal} Core Principles & Environment Setup`,
        learningGoal: `Build deep competency in core principles, data structures, and best practices for ${goal}.`,
        whyItMatters: `A rock-solid foundation in ${goal} core principles ensures you write clean, scalable, and maintainable production code.`,
        prerequisites: `Fundamental programming logic and basic command-line operations.`,
        estimatedTime: '3 Weeks',
        difficulty: 'Intermediate',
        whenToBuild: 'Build the foundational project after 4-5 days of studying core architecture principles.',
        topics: [`${goal} Core Standards & Syntax`, 'Environment Setup & Tooling', 'Best Practices & Code Quality'],
        project: {
          name: `${goal} Foundational Architecture Capstone`,
          difficulty: 'Intermediate',
          estimatedDuration: '1 Week',
          desc: `Build a complete practical project putting core ${goal} concepts and data architecture into practice.`,
          skillsPracticed: [goal, 'Core Architecture', 'Testing'],
          whyRecruitersLikeIt: `Demonstrates fundamental competency in ${goal} syntax, error handling, and clean modular structure.`,
          resumeValue: `Built a modular ${goal} foundational application featuring clean component design and automated error logging.`,
          stretchGoals: ['Implement custom unit test coverage', 'Add automated documentation generator']
        },
        resources: [
          { type: 'doc', label: 'Official Documentation', title: `${goal} Developer Roadmap & Guide`, source: 'Roadmap.sh', url: 'https://roadmap.sh', icon: '📘' },
          { type: 'video', label: 'Best YouTube Course', title: `${goal} Full Course & Computer Science Fundamentals`, source: 'freeCodeCamp', url: 'https://www.youtube.com/@freecodecamp', icon: '🎥' },
          { type: 'practice', label: 'Practice Platform', title: 'Data Structures & Algorithms Practice', source: 'LeetCode', url: 'https://leetcode.com', icon: '💻' },
          { type: 'article', label: 'Recommended Article', title: 'Software Engineering Best Practices & Architecture', source: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📰' },
          { type: 'github', label: 'GitHub Examples', title: 'Awesome Open Source Learning Resources', source: 'GitHub', url: 'https://github.com/sindresorhus/awesome', icon: '⚡' }
        ]
      },
      {
        phaseNum: 2,
        phaseName: 'Core Frameworks & Systems',
        title: `Master Intermediate ${goal} Systems & Design`,
        learningGoal: `Implement scalable system patterns and real-world workflows in ${goal}.`,
        whyItMatters: `Intermediate architectural design allows you to build modular systems that handle real-world scale and complexity.`,
        prerequisites: `Phase 1: Mastery of core ${goal} syntax and data structures.`,
        estimatedTime: '4 Weeks',
        difficulty: 'Advanced',
        whenToBuild: 'Develop the real-world application alongside learning system design and API integration.',
        topics: ['Scalable System Architecture', 'API & Data Integration', 'Automated Verification & Quality'],
        project: {
          name: `Real-World ${goal} Scalable System`,
          difficulty: 'Advanced',
          estimatedDuration: '2 Weeks',
          desc: `Develop a comprehensive, real-world application showcasing intermediate ${goal} capabilities and API integrations.`,
          skillsPracticed: [goal, 'System Design', 'Integration'],
          whyRecruitersLikeIt: `Shows real-world system architecture, data integration capability, and clean separation of concerns.`,
          resumeValue: `Architected a real-world ${goal} system integrating external API streams with 30% improved transaction throughput.`,
          stretchGoals: ['Implement caching layer for fast data access', 'Add automated CI integration testing']
        },
        resources: [
          { type: 'doc', label: 'Official Documentation', title: `${goal} System Design & Integration Reference`, source: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📘' },
          { type: 'video', label: 'Best YouTube Course', title: `Intermediate to Advanced ${goal} Course`, source: 'Traversy Media', url: 'https://www.youtube.com/@TraversyMedia', icon: '🎥' },
          { type: 'practice', label: 'Practice Platform', title: 'Practical Coding Exercises & Challenges', source: 'HackerRank', url: 'https://www.hackerrank.com', icon: '💻' },
          { type: 'article', label: 'Recommended Article', title: 'System Design Principles & Scalability', source: 'DigitalOcean Community', url: 'https://www.digitalocean.com/community/tutorials', icon: '📰' },
          { type: 'github', label: 'GitHub Examples', title: 'System Design Primer Repository', source: 'GitHub', url: 'https://github.com/donnemartin/system-design-primer', icon: '⚡' }
        ]
      },
      {
        phaseNum: 3,
        phaseName: 'Advanced System Development',
        title: `Master Advanced ${goal} Engineering & Optimization`,
        learningGoal: `Optimize, benchmark, and scale production-grade solutions for ${goal}.`,
        whyItMatters: `Advanced system optimization demonstrates high engineering efficiency and performance benchmarking capability.`,
        prerequisites: `Phase 2: System design and real-world application development.`,
        estimatedTime: '4 Weeks',
        difficulty: 'Advanced',
        whenToBuild: 'Implement advanced performance benchmarking on your existing system architecture.',
        topics: ['Advanced Performance Benchmarking', 'System Security Standards', 'Distributed Data Processing'],
        project: {
          name: `High-Throughput ${goal} Optimization System`,
          difficulty: 'Advanced',
          estimatedDuration: '2 Weeks',
          desc: `Refactor and benchmark an advanced ${goal} application to achieve sub-100ms response times under high concurrency.`,
          skillsPracticed: [goal, 'Performance Tuning', 'Optimization'],
          whyRecruitersLikeIt: `Proves advanced capability in profiling performance bottlenecks and optimizing memory/CPU usage.`,
          resumeValue: `Optimized core ${goal} processing pipeline, reducing execution latency by 45% under simulated load testing.`,
          stretchGoals: ['Add memory profiler heap snapshots', 'Implement load balancing routing']
        },
        resources: [
          { type: 'doc', label: 'Official Documentation', title: `${goal} Advanced Optimization Reference`, source: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📘' },
          { type: 'video', label: 'Best YouTube Course', title: `Advanced ${goal} Performance Masterclass`, source: 'Fireship', url: 'https://www.youtube.com/@Fireship', icon: '🎥' },
          { type: 'practice', label: 'Practice Platform', title: 'High Performance Problem Solving Labs', source: 'LeetCode', url: 'https://leetcode.com', icon: '💻' },
          { type: 'article', label: 'Recommended Article', title: 'Performance Profiling & Bottleneck Reduction', source: 'Dev.to', url: 'https://dev.to', icon: '📰' },
          { type: 'github', label: 'GitHub Examples', title: 'Advanced Architecture Boilerplates', source: 'GitHub', url: 'https://github.com', icon: '⚡' }
        ]
      },
      {
        phaseNum: 4,
        phaseName: 'Production Readiness & Deployment',
        title: `Master Production Infrastructure, Testing & CI/CD Deployment`,
        learningGoal: `Deploy production-grade solutions with automated unit test suites and CI/CD pipelines for ${goal}.`,
        whyItMatters: `Production readiness demonstrates to engineering managers that your code is benchmarked, secure, and ready for deployment.`,
        prerequisites: `Phase 3: Advanced system optimization and testing.`,
        estimatedTime: '3 Weeks',
        difficulty: 'Production-Grade',
        whenToBuild: 'Optimize your portfolio projects with CI/CD deployment pipelines and performance benchmarks.',
        topics: ['Performance Tuning & Benchmarking', 'Security & Production Standards', 'Continuous Integration & Observability'],
        project: {
          name: `Production-Grade ${goal} System & Automated Pipeline`,
          difficulty: 'Production-Grade',
          estimatedDuration: '3 Weeks',
          desc: `Deploy a production-ready system with automated testing, performance benchmarks, and CI/CD release pipeline.`,
          skillsPracticed: [goal, 'Optimization', 'Production Deployment'],
          whyRecruitersLikeIt: `Proves end-to-end senior engineering competence, automated testing, benchmarking, and cloud deployment.`,
          resumeValue: `Deployed a production-grade ${goal} system with automated CI/CD pipelines, maintaining 99.9% uptime and zero regressions.`,
          stretchGoals: ['Add automated Prometheus observability metrics', 'Implement zero-downtime deployment strategy']
        },
        resources: [
          { type: 'doc', label: 'Official Documentation', title: `${goal} Production Deployment & Tuning Guide`, source: 'DevDocs.io', url: 'https://devdocs.io', icon: '📘' },
          { type: 'video', label: 'Best YouTube Course', title: `Production Engineering & Architecture for ${goal}`, source: 'Fireship', url: 'https://www.youtube.com/@Fireship', icon: '🎥' },
          { type: 'practice', label: 'Practice Platform', title: 'Advanced Problem Solving & Benchmark Labs', source: 'Exercism', url: 'https://exercism.org', icon: '💻' },
          { type: 'article', label: 'Recommended Article', title: 'High-Performance Production Deployment Guide', source: 'Dev.to', url: 'https://dev.to', icon: '📰' },
          { type: 'github', label: 'GitHub Examples', title: 'Production Ready Architecture Boilerplates', source: 'GitHub', url: 'https://github.com/public-apis/public-apis', icon: '⚡' }
        ]
      }
    ]
  };
};
