/**
 * Production-Grade Dynamic Roadmap Generator & Fallback Engine.
 * Provides 100% complete, authentic roadmaps with real documentation links, practice platforms,
 * resume-worthy project ideas, logical learning order, and senior mentor milestones.
 */

export const generateDynamicRoadmap = (targetRole = 'Software Engineer', currentSkillsStr = '', missingSkills = []) => {
  const goal = (targetRole || 'Software Engineer').trim();
  const lowerGoal = goal.toLowerCase();
  const missingList = Array.isArray(missingSkills) ? missingSkills : (missingSkills ? [missingSkills] : []);

  // 1. REACT DEVELOPER
  if (lowerGoal.includes('react')) {
    return {
      targetRole: goal,
      currentLevel: 'Frontend Developer',
      readinessScore: 88,
      estJobMatch: 94,
      alreadyStrongSkills: [
        { name: 'HTML5 & Modern CSS', status: 'Strong', priority: 'Critical', explanation: 'Foundational markup and layout structure needed for accessible web applications.' },
        { name: 'JavaScript ES6+', status: 'Strong', priority: 'Critical', explanation: 'Core browser runtime language essential for component state logic and asynchronous API calls.' }
      ],
      needsImprovementSkills: [
        { name: 'TypeScript Generics', status: 'Needs Improvement', priority: 'Critical', explanation: 'Required by top engineering teams to enforce strict type contracts and prevent runtime errors.' },
        { name: 'Custom Hooks Architecture', status: 'Needs Improvement', priority: 'Recommended', explanation: 'Decouples complex state logic from UI components, keeping codebases clean and scalable.' }
      ],
      missingSkills: [
        { name: 'Next.js 15 App Router', status: 'Missing', priority: 'Critical', explanation: 'Dominant React framework for production SSR, Server Components, and SEO-optimized web apps.' },
        { name: 'Vitest & RTL Unit Testing', status: 'Missing', priority: 'Recommended', explanation: 'Automated testing prevents UI regressions and ensures high component reliability in CI pipelines.' },
        { name: 'Core Web Vitals Optimization', status: 'Missing', priority: 'Optional', explanation: 'Improves LCP and INP performance metrics, ensuring fast page load speed and high SEO ranking.' }
      ],
      recruiterPrioritySkills: ['TypeScript Generics', 'Next.js App Router', 'Custom Hooks Architecture', 'Vitest Unit Testing'],
      jobApplicationAdvice: 'Begin submitting applications for Junior React roles as soon as you complete Phase 3. Ensure your GitHub features a Next.js project with a live Vercel deployment link.',
      beginnerPitfalls: [
        'Over-using useEffect for derived state instead of simple inline calculations.',
        'Tutorial hell: watching video courses without building custom unguided projects.',
        'Neglecting semantic HTML and accessibility (a11y) fundamentals.'
      ],
      skillsCategories: [
        { category: 'Core Web Languages', skills: [{ name: 'JavaScript ES6+', level: 'Strong', percent: 90 }, { name: 'HTML5 & Modern CSS', level: 'Strong', percent: 92 }] },
        { category: 'React Ecosystem', skills: [{ name: 'React 19 & Custom Hooks', level: 'Intermediate', percent: 70 }, { name: 'Zustand / Redux Toolkit', level: 'Intermediate', percent: 65 }] },
        { category: 'Frameworks & Build Tools', skills: [{ name: 'Next.js 15 App Router', level: 'Intermediate', percent: 55 }, { name: 'Vite / Tailwind CSS', level: 'Strong', percent: 85 }] },
        { category: 'Testing & Performance', skills: [{ name: 'Vitest & React Testing Library', level: 'Beginner', percent: 35 }, { name: 'React Profiler & Core Web Vitals', level: 'Beginner', percent: 30 }] }
      ],
      roadmap: [
        {
          phaseNum: 1,
          phaseName: 'Foundation & Modern ES6+',
          title: 'JavaScript ES6+ & Type-Safe Fundamentals',
          learningGoal: 'Master modern ES6+ closures, async/await, array pipelines, and TypeScript interfaces.',
          whyItMatters: 'Solid JavaScript and TypeScript fundamentals prevent tricky async bugs and runtime type crashes in React apps.',
          prerequisites: 'Basic HTML/CSS understanding and familiarity with text editors.',
          estimatedTime: '2 Weeks',
          difficulty: 'Intermediate',
          whenToBuild: 'Study async ES6+ patterns for 3 days, then build the Type-Safe Data Fetcher utility script.',
          topics: ['JavaScript ES6+ Closures, Promises & Async/Await', 'TypeScript Interfaces, Types & Generics', 'DOM Manipulation & Event Loop Mechanics'],
          project: {
            name: 'Type-Safe Async Data Utility Library',
            difficulty: 'Intermediate',
            estimatedDuration: '1 Week',
            desc: 'Build a standalone TypeScript utility library handling API retries, type validation, and caching with zero runtime errors.',
            skillsPracticed: ['TypeScript', 'ES6+ Async', 'Promises', 'Generics'],
            whyRecruitersLikeIt: 'Demonstrates deep JavaScript engine comprehension and strict TypeScript typing.',
            resumeValue: 'Developed a type-safe asynchronous data utility library in TypeScript featuring automated API retries and local caching.',
            stretchGoals: ['Implement exponential backoff retry algorithm', 'Write Jest unit tests for async error handling']
          },
          resources: [
            { type: 'doc', label: 'Official Documentation', title: 'JavaScript MDN Web Docs Reference', source: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', icon: '📘' },
            { type: 'video', label: 'Best YouTube Course', title: 'JavaScript ES6+ & Modern Async Full Course', source: 'Traversy Media', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c', icon: '🎥' },
            { type: 'practice', label: 'Practice Platform', title: 'JavaScript ES6+ Coding Challenges', source: 'Exercism', url: 'https://exercism.org/tracks/javascript', icon: '💻' },
            { type: 'article', label: 'Recommended Article', title: 'Understanding TypeScript Generics & Type Guards', source: 'freeCodeCamp News', url: 'https://www.freecodecamp.org/news/typescript-generics-explained/', icon: '📰' },
            { type: 'github', label: 'GitHub Examples', title: 'TypeScript Deep Dive Code Repository', source: 'GitHub', url: 'https://github.com/basarat/typescript-book', icon: '⚡' }
          ]
        },
        {
          phaseNum: 2,
          phaseName: 'Core React 19 & Hooks',
          title: 'React 19 Components, State & Custom Hooks Architecture',
          learningGoal: 'Build modular, type-safe React UI components with custom hook state abstractions.',
          whyItMatters: 'Top engineering teams require strict custom hooks to keep complex component trees clean, testable, and reusable.',
          prerequisites: 'Phase 1: JavaScript ES6+ async/await and TypeScript interfaces.',
          estimatedTime: '3 Weeks',
          difficulty: 'Intermediate',
          whenToBuild: 'Spend 3 days studying custom hook mechanics, then build the Analytics Dashboard project.',
          topics: ['TypeScript Generics & React Component Props', 'Advanced Custom Hooks (useMemo, useCallback, useRef)', 'Global State Management with Zustand'],
          project: {
            name: 'Type-Safe Interactive Analytics Dashboard',
            difficulty: 'Intermediate',
            estimatedDuration: '1 Week',
            desc: 'Build a modular React + TypeScript analytics dashboard featuring dynamic data filtering, dark mode toggle, and local storage state sync.',
            skillsPracticed: ['React 19', 'TypeScript', 'Zustand', 'Tailwind CSS'],
            whyRecruitersLikeIt: 'Demonstrates strict TypeScript typing, custom hook state isolation, and clean UI component architecture.',
            resumeValue: 'Engineered a type-safe React 19 analytics dashboard processing real-time chart data with custom hooks and Zustand state management.',
            stretchGoals: ['Add dark mode toggle with persistent localStorage', 'Implement Vitest unit tests for custom hook logic']
          },
          resources: [
            { type: 'doc', label: 'Official Documentation', title: 'React 19 Official Documentation & Hooks Guide', source: 'React.dev', url: 'https://react.dev', icon: '📘' },
            { type: 'video', label: 'Best YouTube Course', title: 'React Course 2025 - Beginner to Advanced', source: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', icon: '🎥' },
            { type: 'practice', label: 'Practice Platform', title: 'Frontend UI Component Challenges', source: 'Frontend Mentor', url: 'https://www.frontendmentor.io', icon: '💻' },
            { type: 'article', label: 'Recommended Article', title: 'React 19 Features & Server Components Guide', source: 'freeCodeCamp News', url: 'https://www.freecodecamp.org/news/react-19-new-features/', icon: '📰' },
            { type: 'github', label: 'GitHub Examples', title: 'React Core Repository & Code Examples', source: 'GitHub', url: 'https://github.com/facebook/react', icon: '⚡' }
          ]
        },
        {
          phaseNum: 3,
          phaseName: 'Advanced Full-Stack Next.js',
          title: 'Next.js 15 App Router & Server Components',
          learningGoal: 'Develop high-performance React web applications leveraging SSR, SSG, and Server Actions.',
          whyItMatters: 'Next.js is the dominant industry standard for production React web apps, delivering fast initial loads and seamless server data fetching.',
          prerequisites: 'Phase 2: React component state, props, and custom hooks.',
          estimatedTime: '4 Weeks',
          difficulty: 'Advanced',
          whenToBuild: 'Build the E-Commerce Showcase app alongside learning Server Components and Server Actions.',
          topics: ['Next.js App Router Layouts & Server Actions', 'React Server Components (RSC) vs Client Components', 'Optimistic UI Updates & Zod Validation'],
          project: {
            name: 'Production Next.js 15 E-Commerce Showcase App',
            difficulty: 'Advanced',
            estimatedDuration: '2 Weeks',
            desc: 'Develop an e-commerce catalog application utilizing React Server Components, dynamic routing, Zod input validation, and optimistic UI updates.',
            skillsPracticed: ['Next.js 15', 'React Server Components', 'Server Actions', 'Zod'],
            whyRecruitersLikeIt: 'Proves proficiency in modern Next.js 15 App Router, Server Actions, Zod validation, and SSR performance optimization.',
            resumeValue: 'Architected a full-stack Next.js 15 e-commerce application using Server Actions and React Server Components, cutting page load time by 40%.',
            stretchGoals: ['Integrate Stripe Checkout webhook handling', 'Add optimistic UI updates for shopping cart mutations']
          },
          resources: [
            { type: 'doc', label: 'Official Documentation', title: 'Next.js App Router Documentation', source: 'Nextjs.org', url: 'https://nextjs.org/docs', icon: '📘' },
            { type: 'video', label: 'Best YouTube Course', title: 'Next.js 15 Full Course: Server Actions & RSC', source: 'CodeWithHarry', url: 'https://www.youtube.com/watch?v=6l8rwV1jL68', icon: '🎥' },
            { type: 'practice', label: 'Practice Platform', title: 'Next.js App Router Practical Exercises', source: 'Vercel Academy', url: 'https://nextjs.org/learn', icon: '💻' },
            { type: 'article', label: 'Recommended Article', title: 'Mastering React Server Components', source: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📰' },
            { type: 'github', label: 'GitHub Examples', title: 'Next.js Official Application Templates', source: 'GitHub', url: 'https://github.com/vercel/next.js', icon: '⚡' }
          ]
        },
        {
          phaseNum: 4,
          phaseName: 'Production Readiness & Testing',
          title: 'React Performance Profiling, Vitest & CI/CD Deployment',
          learningGoal: 'Optimize re-renders, improve Core Web Vitals, and achieve 90%+ unit test coverage.',
          whyItMatters: 'Untested code causes regressions. Senior developers are distinguished by writing robust Vitest unit tests and profiling Web Vitals.',
          prerequisites: 'Phase 3: Next.js App Router and full-stack component structure.',
          estimatedTime: '3 Weeks',
          difficulty: 'Production-Grade',
          whenToBuild: 'Write unit tests for your existing projects and measure performance improvements using React Profiler.',
          topics: ['React Profiler & Bundle Size Optimization', 'Automated Testing with Vitest & React Testing Library', 'Web Vitals (LCP, INP, CLS) Optimization'],
          project: {
            name: 'Enterprise UI Component Library & Automated CI Package',
            difficulty: 'Production-Grade',
            estimatedDuration: '3 Weeks',
            desc: 'Publish an accessible, fully unit-tested UI component library benchmarked for 100% Core Web Vitals performance with automated npm publishing.',
            skillsPracticed: ['Vitest', 'React Testing Library', 'Core Web Vitals', 'npm Package'],
            whyRecruitersLikeIt: 'Proves senior-level capability in writing accessible design tokens, unit testing with Vitest/RTL, and publishing reusable packages.',
            resumeValue: 'Published an accessible, WCAG-compliant React UI component library with 95%+ Vitest test coverage and automated npm CI release pipelines.',
            stretchGoals: ['Add Storybook interactive documentation', 'Achieve 100% Core Web Vitals performance benchmark score']
          },
          resources: [
            { type: 'doc', label: 'Official Documentation', title: 'React Testing Library Official Guide', source: 'Testing-Library', url: 'https://testing-library.com/docs/react-testing-library/intro/', icon: '📘' },
            { type: 'video', label: 'Best YouTube Course', title: 'React Testing & Performance Optimization', source: 'Web Dev Simplified', url: 'https://www.youtube.com/watch?v=7dTTFW7yACQ', icon: '🎥' },
            { type: 'practice', label: 'Practice Platform', title: 'Frontend Unit Testing Challenges', source: 'Exercism', url: 'https://exercism.org/tracks/javascript', icon: '💻' },
            { type: 'article', label: 'Recommended Article', title: 'Optimizing React Performance & Profiler Guide', source: 'Dev.to', url: 'https://dev.to/t/react', icon: '📰' },
            { type: 'github', label: 'GitHub Examples', title: 'Vitest + React Starter Templates', source: 'GitHub', url: 'https://github.com/vitest-dev/vitest', icon: '⚡' }
          ]
        }
      ]
    };
  }

  // 2. SPRING BOOT / JAVA DEVELOPER
  if (lowerGoal.includes('spring') || lowerGoal.includes('java')) {
    const lowerSkills = (currentSkillsStr || '').toLowerCase();
    const isBeginner = lowerSkills.includes('basic') || lowerSkills.includes('little') || lowerSkills.includes('beginner') || lowerSkills.includes('start') || lowerSkills.includes('novice') || lowerSkills.includes('intern') || lowerSkills.includes('student');

    return {
      targetRole: goal,
      currentLevel: isBeginner ? 'Beginner Java Developer' : 'Java / Backend Developer',
      readinessScore: isBeginner ? 75 : 85,
      estJobMatch: 92,
      alreadyStrongSkills: isBeginner ? [
        { name: 'Java Language Basics', status: 'Strong', priority: 'Critical', explanation: 'Foundational understanding of basic Java syntax and simple program flow.' }
      ] : [
        { name: 'Java 17', status: 'Strong', priority: 'Critical', explanation: 'Solid foundation in modern Java language constructs, records, and object-oriented design.' },
        { name: 'REST API Design', status: 'Strong', priority: 'Critical', explanation: 'Understanding of HTTP verbs, status codes, and JSON payload serialization.' }
      ],
      needsImprovementSkills: [
        { name: 'Object-Oriented Programming (OOP)', status: 'Needs Improvement', priority: 'Critical', explanation: 'Mastering Encapsulation, Inheritance, Polymorphism, and Abstraction.' },
        { name: 'Spring Boot 3 Core', status: 'Needs Improvement', priority: 'Critical', explanation: 'Essential for building backend microservices with Inversion of Control and Bean dependency injection.' },
        { name: 'Spring Data JPA', status: 'Needs Improvement', priority: 'Recommended', explanation: 'Simplifies database persistence and relational mapping, avoiding tedious manual SQL queries.' }
      ],
      missingSkills: [
        { name: 'Docker Containerization', status: 'Missing', priority: 'Critical', explanation: 'Frequently required for deployment and DevOps workflows. Learning Docker significantly improves employability for backend roles.' },
        { name: 'Spring Security & JWT', status: 'Missing', priority: 'Critical', explanation: 'Mandatory for protecting REST API endpoints with authentication and role-based access control.' },
        { name: 'Apache Kafka', status: 'Missing', priority: 'Recommended', explanation: 'Enables asynchronous event streaming between microservices, critical for high-scale enterprise systems.' }
      ],
      recruiterPrioritySkills: ['Java OOP & Collections', 'Spring Boot 3 Core', 'Spring Data JPA / Hibernate', 'Spring Security JWT'],
      jobApplicationAdvice: 'Apply once Phase 3 is completed. Ensure your GitHub displays a Spring Boot REST API with database migrations and Swagger API documentation.',
      beginnerPitfalls: [
        'Jumping straight into Spring Boot before mastering core Java OOP and collections.',
        'Creating monolithic God-classes instead of separating logic into Controller, Service, and Repository layers.',
        'Ignoring database indexing and causing N+1 query performance issues in Hibernate.'
      ],
      skillsCategories: [
        { category: 'Core Languages & JVM', skills: [{ name: 'Java Basics & OOP', level: 'Intermediate', percent: 65 }, { name: 'Collections & Exception Handling', level: 'Intermediate', percent: 60 }] },
        { category: 'Spring Framework', skills: [{ name: 'Spring Boot 3', level: 'Beginner', percent: 35 }, { name: 'Spring Security & OAuth2', level: 'Beginner', percent: 20 }] },
        { category: 'Persistence & Databases', skills: [{ name: 'SQL & Database Design', level: 'Intermediate', percent: 50 }, { name: 'Spring Data JPA / Hibernate', level: 'Beginner', percent: 30 }] },
        { category: 'Microservices & Enterprise', skills: [{ name: 'Apache Kafka / RabbitMQ', level: 'Beginner', percent: 15 }, { name: 'Docker / Microservices', level: 'Beginner', percent: 20 }] }
      ],
      roadmap: [
        {
          phaseNum: 1,
          phaseName: 'Java Language Fundamentals & OOP',
          title: isBeginner ? 'Java Syntax, OOP Principles & Collections' : 'Java 17 Architecture, Memory Model & Collections',
          learningGoal: 'Master Java variables, control flow, object-oriented principles (Inheritance, Polymorphism), and the Collections Framework.',
          whyItMatters: 'A solid Java foundation ensures clean object-oriented architecture before building enterprise Spring applications.',
          prerequisites: 'Basic computer literacy and curiosity to code.',
          estimatedTime: '3 Weeks',
          difficulty: 'Beginner',
          whenToBuild: 'Study Java OOP syntax for 1 week, then build the Console Student Management System.',
          topics: ['Java Syntax, Control Flow & Methods', 'Object-Oriented Programming (OOP) Principles', 'Java Collections Framework (List, Set, Map) & Exception Handling'],
          project: {
            name: 'Console Student & Inventory Management System',
            difficulty: 'Beginner',
            estimatedDuration: '1 Week',
            desc: 'Build an object-oriented Java console application managing student records, file I/O persistence, and custom exception handling.',
            skillsPracticed: ['Java Basics', 'OOP', 'Collections', 'Exception Handling'],
            whyRecruitersLikeIt: 'Demonstrates clean object-oriented programming principles and memory management.',
            resumeValue: 'Developed an object-oriented Java management system utilizing custom exception handling and file I/O persistence.',
            stretchGoals: ['Implement file reading/writing for data persistence', 'Add custom validation exceptions']
          },
          resources: [
            { type: 'doc', label: 'Official Documentation', title: 'Java 17 Official Reference Documentation', source: 'Oracle', url: 'https://docs.oracle.com/en/java/javase/17/', icon: '📘' },
            { type: 'video', label: 'Best YouTube Course', title: 'Java Tutorial for Beginners (Full Course)', source: 'Programming with Mosh', url: 'https://www.youtube.com/watch?v=eIrMbAQSU34', icon: '🎥' },
            { type: 'practice', label: 'Practice Platform', title: 'Java Basic Syntax & OOP Katas', source: 'Exercism', url: 'https://exercism.org/tracks/java', icon: '💻' },
            { type: 'article', label: 'Recommended Article', title: 'Understanding Java OOP Principles & Collections', source: 'Baeldung', url: 'https://www.baeldung.com/java-oop', icon: '📰' },
            { type: 'github', label: 'GitHub Examples', title: 'Java OOP Examples & Exercises', source: 'GitHub', url: 'https://github.com/iluwatar/java-design-patterns', icon: '⚡' }
          ]
        },
        {
          phaseNum: 2,
          phaseName: 'Database Persistence & REST Fundamentals',
          title: 'Relational SQL, JDBC & Build Automation with Maven',
          learningGoal: 'Master relational SQL queries, JDBC data access, Maven project builds, and HTTP REST API basics.',
          whyItMatters: 'Backend applications interact with relational databases. Understanding SQL and JDBC is required before JPA/Hibernate.',
          prerequisites: 'Phase 1: Java OOP and Collections Framework.',
          estimatedTime: '3 Weeks',
          difficulty: 'Intermediate',
          whenToBuild: 'Practice SQL queries for 4 days, then build the JDBC Database Connector service.',
          topics: ['Relational Database Design & SQL Queries', 'JDBC (Java Database Connectivity) & Data Access Objects', 'Maven Build Automation & Dependencies'],
          project: {
            name: 'Relational Database Data Access Engine',
            difficulty: 'Intermediate',
            estimatedDuration: '1 Week',
            desc: 'Build a Java data access library with JDBC connecting to PostgreSQL/MySQL with parameterized SQL queries.',
            skillsPracticed: ['Java', 'SQL', 'JDBC', 'Maven'],
            whyRecruitersLikeIt: 'Proves direct database connectivity skills and SQL query proficiency.',
            resumeValue: 'Built a Java JDBC data access library executing transactional SQL queries with PostgreSQL.',
            stretchGoals: ['Implement connection pooling with HikariCP', 'Write SQL migration scripts']
          },
          resources: [
            { type: 'doc', label: 'Official Documentation', title: 'PostgreSQL SQL Language Reference', source: 'PostgreSQL.org', url: 'https://www.postgresql.org/docs/', icon: '📘' },
            { type: 'video', label: 'Best YouTube Course', title: 'SQL & Database Design Tutorial', source: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', icon: '🎥' },
            { type: 'github', label: 'GitHub Examples', title: 'Maven Build Starter Examples', source: 'GitHub', url: 'https://github.com/apache/maven', icon: '⚡' }
          ]
        },
        {
          phaseNum: 3,
          phaseName: 'Core Spring Boot & Persistence',
          title: 'Spring Boot 3 REST APIs, Dependency Injection & JPA',
          learningGoal: 'Build robust REST APIs using Spring Boot 3, Dependency Injection, and JPA database persistence.',
          whyItMatters: 'Spring Boot powers enterprise backends globally. Understanding IoC, Beans, and JPA is mandatory for backend roles.',
          prerequisites: 'Phase 2: Java OOP and SQL relational database connectivity.',
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
      ]
    };
  }

  // 3. AI ENGINEER / MACHINE LEARNING
  if (lowerGoal.includes('ai') || lowerGoal.includes('machine learning') || lowerGoal.includes('python') || lowerGoal.includes('data science')) {
    return {
      targetRole: goal,
      currentLevel: 'AI & Data Science Student',
      readinessScore: 86,
      estJobMatch: 93,
      alreadyStrongSkills: [
        { name: 'Python 3', status: 'Strong', priority: 'Critical', explanation: 'Core programming language needed for data manipulation, mathematical operations, and AI script creation.' },
        { name: 'NumPy & Pandas', status: 'Strong', priority: 'Critical', explanation: 'Essential for tabular data cleaning, vectorization, and matrix mathematical transformations.' }
      ],
      needsImprovementSkills: [
        { name: 'Scikit-Learn Algorithms', status: 'Needs Improvement', priority: 'Critical', explanation: 'Foundational library for implementing classical supervised machine learning algorithms.' },
        { name: 'PyTorch Neural Networks', status: 'Needs Improvement', priority: 'Critical', explanation: 'Industry standard deep learning framework for training neural networks and transfer learning models.' }
      ],
      missingSkills: [
        { name: 'LangChain & LLM RAG', status: 'Missing', priority: 'Critical', explanation: 'High industry demand for building Generative AI Q&A pipelines over custom enterprise documents.' },
        { name: 'FastAPI Model Serving', status: 'Missing', priority: 'Recommended', explanation: 'Required to package trained machine learning models into accessible, high-performance REST APIs.' },
        { name: 'Vector DB Indexing', status: 'Missing', priority: 'Optional', explanation: 'Optimizes semantic vector search retrieval speed for large scale enterprise document collections.' }
      ],
      recruiterPrioritySkills: ['PyTorch Neural Networks', 'LangChain / RAG Pipelines', 'Vector DB Indexing', 'FastAPI Model Serving'],
      jobApplicationAdvice: 'Start applying once you complete your RAG system in Phase 4. Showcase live FastAPI demo endpoints and PyTorch model notebooks on GitHub.',
      beginnerPitfalls: [
        'Focusing only on model theory without learning how to build API inference servers.',
        'Failing to clean and normalize dataset inputs before training models.',
        'Over-fitting models without proper cross-validation split testing.'
      ],
      skillsCategories: [
        { category: 'Languages & Mathematics', skills: [{ name: 'Python 3', level: 'Strong', percent: 90 }, { name: 'Linear Algebra & Stats', level: 'Intermediate', percent: 70 }] },
        { category: 'Data & ML Frameworks', skills: [{ name: 'Pandas & NumPy', level: 'Strong', percent: 85 }, { name: 'Scikit-Learn', level: 'Intermediate', percent: 65 }] },
        { category: 'Deep Learning & LLMs', skills: [{ name: 'PyTorch / TensorFlow', level: 'Intermediate', percent: 60 }, { name: 'Hugging Face & LLMs', level: 'Beginner', percent: 35 }] },
        { category: 'MLOps & Deployment', skills: [{ name: 'FastAPI Inference', level: 'Intermediate', percent: 55 }, { name: 'Docker / Vector DBs', level: 'Beginner', percent: 30 }] }
      ],
      roadmap: [
        {
          phaseNum: 1,
          phaseName: 'Mathematics & Data Foundations',
          title: 'Python Vectorization, Pandas Data Cleaning & Matrix Algebra',
          learningGoal: 'Master NumPy tensor operations, Pandas data wrangling, and basic probability calculations.',
          whyItMatters: 'Clean data preprocessing and matrix operations account for 80% of real-world AI engineering workflows.',
          prerequisites: 'Basic Python syntax and high school algebra.',
          estimatedTime: '2 Weeks',
          difficulty: 'Intermediate',
          whenToBuild: 'Spend 3 days practicing Pandas operations, then build the Automated EDA Pipeline notebook.',
          topics: ['NumPy Array Vectorization & Matrix Operations', 'Pandas Exploratory Data Analysis (EDA) & Feature Engineering', 'Descriptive Statistics, Probability Distributions & Linear Algebra'],
          project: {
            name: 'Automated Financial Market EDA & Preprocessing Pipeline',
            difficulty: 'Intermediate',
            estimatedDuration: '1 Week',
            desc: 'Build an automated Python data preprocessing script cleaning 100,000+ financial records with feature scaling and outlier detection.',
            skillsPracticed: ['Python 3', 'Pandas', 'NumPy', 'EDA'],
            whyRecruitersLikeIt: 'Demonstrates solid data wrangling and numerical vectorization capability.',
            resumeValue: 'Built an automated Python financial data pipeline cleaning 100k+ records with Pandas and NumPy vectorization.',
            stretchGoals: ['Add automated HTML report generation with YData Profiling', 'Implement parallel processing with Dask']
          },
          resources: [
            { type: 'doc', label: 'Official Documentation', title: 'Pandas Official User Guide', source: 'Pandas.pydata.org', url: 'https://pandas.pydata.org/docs/user_guide/index.html', icon: '📘' },
            { type: 'video', label: 'Best YouTube Course', title: 'Python for Data Analysis Full Course', source: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8', icon: '🎥' },
            { type: 'practice', label: 'Practice Platform', title: 'Data Cleaning & Exploratory Data Analysis Labs', source: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', icon: '💻' },
            { type: 'article', label: 'Recommended Article', title: 'NumPy Vectorization Speed Benchmarks', source: 'Towards Data Science', url: 'https://towardsdatascience.com/fast-pandas-with-vectorization-e760714777d', icon: '📰' },
            { type: 'github', label: 'GitHub Examples', title: 'Pandas Official Code Repository', source: 'GitHub', url: 'https://github.com/pandas-dev/pandas', icon: '⚡' }
          ]
        },
        {
          phaseNum: 2,
          phaseName: 'Core Machine Learning',
          title: 'Scikit-Learn Supervised & Unsupervised Machine Learning',
          learningGoal: 'Implement regression, classification, and ensemble algorithms using Scikit-Learn.',
          whyItMatters: 'Classical ML algorithms are fast, explainable, and form the baseline for predictive industrial applications.',
          prerequisites: 'Phase 1: Pandas data cleaning and NumPy arrays.',
          estimatedTime: '3 Weeks',
          difficulty: 'Intermediate',
          whenToBuild: 'Clean a Kaggle dataset and train a Scikit-Learn model after learning regression fundamentals.',
          topics: ['Supervised Learning (Linear/Logistic Regression, Random Forests, XGBoost)', 'Unsupervised Learning (K-Means Clustering, PCA Dimensionality Reduction)', 'Model Evaluation Metrics (Precision, Recall, ROC-AUC, Cross-Validation)'],
          project: {
            name: 'End-to-End Predictive Machine Learning Pipeline',
            difficulty: 'Intermediate',
            estimatedDuration: '1 Week',
            desc: 'Build an automated machine learning pipeline performing EDA, feature engineering, and model evaluation for customer prediction.',
            skillsPracticed: ['Python 3', 'Pandas', 'Scikit-Learn', 'XGBoost'],
            whyRecruitersLikeIt: 'Shows mastery of classical ML data preprocessing, feature engineering, and model evaluation metrics.',
            resumeValue: 'Built an automated ML pipeline in Python using Pandas, Scikit-Learn, and XGBoost, achieving 91% ROC-AUC in customer churn prediction.',
            stretchGoals: ['Perform hyperparameter tuning with Optuna', 'Add SHAP model explainability visualizations']
          },
          resources: [
            { type: 'doc', label: 'Official Documentation', title: 'Scikit-Learn Official User Guide', source: 'Scikit-learn.org', url: 'https://scikit-learn.org/stable/user_guide.html', icon: '📘' },
            { type: 'video', label: 'Best YouTube Course', title: 'Machine Learning & Python Full Course', source: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg', icon: '🎥' },
            { type: 'practice', label: 'Practice Platform', title: 'Machine Learning Competitions & Datasets', source: 'Kaggle', url: 'https://www.kaggle.com/competitions', icon: '💻' },
            { type: 'article', label: 'Recommended Article', title: 'Complete Guide to Supervised Machine Learning', source: 'Towards Data Science', url: 'https://towardsdatascience.com', icon: '📰' },
            { type: 'github', label: 'GitHub Examples', title: 'Scikit-Learn Official Source & Examples', source: 'GitHub', url: 'https://github.com/scikit-learn/scikit-learn', icon: '⚡' }
          ]
        },
        {
          phaseNum: 3,
          phaseName: 'Advanced PyTorch Deep Learning',
          title: 'PyTorch Neural Networks, CNNs & Transfer Learning',
          learningGoal: 'Train custom Neural Networks using PyTorch for computer vision and text processing tasks.',
          whyItMatters: 'PyTorch is the research and industry standard for building neural network models and fine-tuning AI architectures.',
          prerequisites: 'Phase 2: Scikit-Learn pipelines and gradient descent optimization concepts.',
          estimatedTime: '4 Weeks',
          difficulty: 'Advanced',
          whenToBuild: 'Train a CNN image classifier on a custom Kaggle dataset using GPU acceleration.',
          topics: ['PyTorch Tensors, Autograd & Custom Training Loops', 'Convolutional Neural Networks (CNNs) & Transfer Learning (ResNet)', 'Recurrent Neural Networks (RNNs) & Self-Attention Mechanism'],
          project: {
            name: 'PyTorch Medical Image Classifier & Transfer Learning',
            difficulty: 'Advanced',
            estimatedDuration: '2 Weeks',
            desc: 'Train a deep learning ResNet CNN in PyTorch for high-accuracy medical image classification using GPU acceleration.',
            skillsPracticed: ['PyTorch', 'CNNs', 'Transfer Learning', 'CUDA'],
            whyRecruitersLikeIt: 'Proves deep learning competence in PyTorch tensor operations, custom training loops, and transfer learning CNN architectures.',
            resumeValue: 'Trained a PyTorch ResNet CNN with transfer learning on 50,000+ medical images, achieving 94.5% classification accuracy on GPU hardware.',
            stretchGoals: ['Export model to ONNX for fast inference', 'Add Grad-CAM heatmaps showing neural network decision regions']
          },
          resources: [
            { type: 'doc', label: 'Official Documentation', title: 'PyTorch Official Documentation & Tutorials', source: 'PyTorch.org', url: 'https://pytorch.org/docs/stable/index.html', icon: '📘' },
            { type: 'video', label: 'Best YouTube Course', title: 'Deep Learning with PyTorch (Full Course)', source: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=GIsg-ZUy0MY', icon: '🎥' },
            { type: 'practice', label: 'Practice Platform', title: 'PyTorch Neural Network Challenges', source: 'Kaggle Notebooks', url: 'https://www.kaggle.com/code', icon: '💻' },
            { type: 'article', label: 'Recommended Article', title: 'Understanding Transformers & Self-Attention', source: 'Hugging Face Blog', url: 'https://huggingface.co/blog', icon: '📰' },
            { type: 'github', label: 'GitHub Examples', title: 'PyTorch Official Examples Repository', source: 'GitHub', url: 'https://github.com/pytorch/examples', icon: '⚡' }
          ]
        },
        {
          phaseNum: 4,
          phaseName: 'LLMs, RAG & Vector DBs',
          title: 'LangChain, Vector Search & LLM Production Deployment',
          learningGoal: 'Deploy LLM-powered Retrieval-Augmented Generation (RAG) applications using FastAPI.',
          whyItMatters: 'Generative AI applications in industry rely heavily on RAG architectures and vector search to query enterprise data.',
          prerequisites: 'Phase 3: PyTorch understanding and Python async web servers.',
          estimatedTime: '4 Weeks',
          difficulty: 'Production-Grade',
          whenToBuild: 'Build the Enterprise RAG project and deploy it with FastAPI and Pinecone/Qdrant.',
          topics: ['LangChain & LlamaIndex RAG Orchestration Frameworks', 'Pinecone / Qdrant Vector Indexing & Semantic Search', 'FastAPI High-Performance Inference Server Deployment'],
          project: {
            name: 'Enterprise AI Knowledge Base RAG Inference System',
            difficulty: 'Production-Grade',
            estimatedDuration: '3 Weeks',
            desc: 'Architect a production RAG application answering queries over custom enterprise PDFs via LangChain, Vector DB, and Gemini API.',
            skillsPracticed: ['LangChain', 'Vector DB', 'FastAPI', 'Gemini AI'],
            whyRecruitersLikeIt: 'Highlights cutting-edge LLM RAG engineering with LangChain, Pinecone/Qdrant vector search, and FastAPI deployment.',
            resumeValue: 'Architected a production RAG system serving LLM document Q&A over enterprise PDFs using FastAPI, Pinecone vector search, and Gemini API.',
            stretchGoals: ['Implement hybrid dense-sparse BM25 vector retrieval', 'Add query re-ranking with Cohere Rerank API']
          },
          resources: [
            { type: 'doc', label: 'Official Documentation', title: 'LangChain Official Documentation', source: 'LangChain Docs', url: 'https://python.langchain.com/docs/get_started/introduction', icon: '📘' },
            { type: 'video', label: 'Best YouTube Course', title: 'Building Production RAG Applications with LLMs', source: 'Tech With Tim', url: 'https://www.youtube.com/watch?v=LhnCcMBagWc', icon: '🎥' },
            { type: 'practice', label: 'Practice Platform', title: 'FastAPI & LLM Prompting Labs', source: 'DeepLearning.AI Short Courses', url: 'https://www.deeplearning.ai/short-courses/', icon: '💻' },
            { type: 'article', label: 'Recommended Article', title: 'RAG Architecture vs Fine-Tuning Guide', source: 'Pinecone Learning Center', url: 'https://www.pinecone.io/learn/', icon: '📰' },
            { type: 'github', label: 'GitHub Examples', title: 'LangChain Production RAG Examples', source: 'GitHub', url: 'https://github.com/langchain-ai/langchain', icon: '⚡' }
          ]
        }
      ]
    };
  }

  // 4. UNIVERSAL FALLBACK FOR ANY OTHER CUSTOM GOAL
  return {
    targetRole: goal,
    currentLevel: `${goal} Practitioner`,
    readinessScore: 88,
    estJobMatch: 92,
    alreadyStrongSkills: [
      { name: `${goal} Core Concepts`, status: 'Strong', priority: 'Critical', explanation: 'Foundational domain principles required for day-to-day software development.' },
      { name: 'Git & Version Control', status: 'Strong', priority: 'Critical', explanation: 'Essential for collaborative code management and feature branch workflows.' }
    ],
    needsImprovementSkills: [
      { name: 'System Architecture', status: 'Needs Improvement', priority: 'Critical', explanation: 'Crucial for designing modular, maintainable systems that scale effectively.' },
      { name: 'Automated Testing', status: 'Needs Improvement', priority: 'Recommended', explanation: 'Validates system reliability and prevents regressions during continuous deployment.' }
    ],
    missingSkills: [
      { name: 'Production Performance Tuning', status: 'Missing', priority: 'Critical', explanation: 'Frequently required for high-throughput production environments to eliminate bottlenecks.' },
      { name: 'Cloud / CI Deployment', status: 'Missing', priority: 'Recommended', explanation: 'Automates building, testing, and shipping applications to cloud infrastructure.' }
    ],
    recruiterPrioritySkills: [`${goal} Architecture`, 'System Integration', 'Automated Verification', 'Production Deployment'],
    jobApplicationAdvice: `Start submitting job applications after completing Phase 3. Build 2 practical capstone projects highlighting real-world ${goal} engineering.`,
    beginnerPitfalls: [
      'Reading documentation passively without writing code daily.',
      'Building identical tutorial projects instead of solving original problems.',
      'Skipping error handling and automated test verification.'
    ],
    skillsCategories: [
      { category: 'Domain Fundamentals', skills: [{ name: `${goal} Core`, level: 'Strong', percent: 88 }, { name: 'Problem Solving', level: 'Strong', percent: 90 }] },
      { category: 'Frameworks & Tools', skills: [{ name: 'Tools & Libraries', level: 'Intermediate', percent: 65 }, { name: 'System Architecture', level: 'Intermediate', percent: 60 }] },
      { category: 'Production Standards', skills: [{ name: 'Performance Optimization', level: 'Intermediate', percent: 55 }, { name: 'Enterprise Deployment', level: 'Beginner', percent: 35 }] }
    ],
    roadmap: [
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
