export const mockResumeAnalysis = {
  score: 92,
  atsScore: 94,
  candidateLevel: "Software Engineering Candidate",
  interviewPotential: "High Interview Callback Potential",
  atsAssessment: "Fully ATS Machine-Readable Layout",
  executiveSummary: "Your resume demonstrates strong technical depth, clear project achievements, and standard ATS formatting.",
  strengths: [
    "Strong technical skills depth in React and TypeScript",
    "Clean single-column layout with high ATS parser readability",
    "Clear project achievements with performance metrics"
  ],
  weaknesses: [
    "No quantified performance metrics on recent work",
    "Missing cloud infrastructure & deployment keywords"
  ],
  missingSkills: [
    "Docker / Containerization",
    "GraphQL",
    "AWS / Cloud Deployment"
  ],
  recommendations: [
    "Quantify project impact by mentioning measurable outcomes like performance improvements or user completion rates.",
    "Add a dedicated DevOps & Cloud section with Docker and AWS experience.",
    "Include direct GitHub repository & live demo links for top projects."
  ]
};

export const mockDashboardData = {
  user: {
    name: "Alex Chen",
    email: "alex.chen@university.edu",
    targetRole: "Frontend Engineer / Full-Stack Developer",
    experienceLevel: "Entry-Level (0-2 Years)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
  },
  scores: {
    careerReadiness: {
      score: 86,
      change: "+12%",
      status: "High Readiness",
      summary: "Top 10% candidate pool for Frontend roles."
    },
    resumeScore: {
      score: 92,
      atsScore: 94,
      formattingScore: 90,
      impactScore: 88,
      lastUpdated: "2 hours ago",
      fileName: "Alex_Chen_Frontend_Resume.pdf"
    },
    jobMatchRate: {
      score: 88,
      targetCompany: "Stripe / Vercel (Frontend Developer)",
      matchedSkillsCount: 14,
      missingSkillsCount: 3
    },
    roadmapProgress: {
      percentage: 68,
      completedMilestones: 4,
      totalMilestones: 6,
      currentMilestoneTitle: "Week 5: Master Next.js App Router & Server Components"
    },
    interviewScore: {
      score: 8.8,
      totalSessions: 5,
      latestRating: "Strong Hire"
    }
  },
  quickActions: [
    {
      id: "resume",
      title: "Analyze New Resume",
      desc: "Upload PDF and get instant ATS & impact scores",
      icon: "FileText",
      color: "bg-blue-600/10",
      accent: "text-blue-500",
      border: "border-blue-500/30"
    },
    {
      id: "job-match",
      title: "Match Job Description",
      desc: "Paste JD to discover keyword matches & missing skills",
      icon: "Target",
      color: "bg-blue-600/10",
      accent: "text-blue-500",
      border: "border-blue-500/30"
    },
    {
      id: "roadmap",
      title: "Learning Roadmap",
      desc: "Track weekly skill milestones & course recommendations",
      icon: "Map",
      color: "bg-green-600/10",
      accent: "text-green-500",
      border: "border-green-500/30"
    },
    {
      id: "interview",
      title: "AI Mock Interview",
      desc: "Practice real-time Q&A with live STAR feedback",
      icon: "Mic",
      color: "bg-amber-600/10",
      accent: "text-amber-500",
      border: "border-amber-500/30"
    }
  ],
  recentActivities: [
    {
      id: 1,
      type: "resume",
      title: "Resume Analyzed",
      detail: "Alex_Chen_Frontend_Resume.pdf received 92/100 ATS rating",
      timestamp: "2 hours ago",
      badge: "+4 pts improved",
      badgeColor: "bg-green-500/10 text-green-400 border-green-500/30"
    },
    {
      id: 2,
      type: "job-match",
      title: "Job Match Run",
      detail: "Matched against 'Frontend Engineer at Vercel' - 88% Match",
      timestamp: "Yesterday, 4:15 PM",
      badge: "High Match",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30"
    },
    {
      id: 3,
      type: "roadmap",
      title: "Milestone Completed",
      detail: "Finished 'Week 4: Advanced TypeScript & State Management'",
      timestamp: "2 days ago",
      badge: "Week 4/6 Done",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30"
    },
    {
      id: 4,
      type: "interview",
      title: "Mock Interview Completed",
      detail: "Behavioral STAR Interview Session • Score: 9.0/10",
      timestamp: "3 days ago",
      badge: "Strong Hire",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30"
    }
  ]
};
