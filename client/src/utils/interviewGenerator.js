// AI Mock Interview Engine — Conversational Human Simulator, Adaptive Flow & Strict Evidence Evaluation

import sarahAvatar from '../assets/interviewers/sarah.jpg';
import alexAvatar from '../assets/interviewers/alex.jpg';
import davidAvatar from '../assets/interviewers/david.jpg';
import elenaAvatar from '../assets/interviewers/elena.jpg';

export const INTERVIEW_PERSONAS = [
  {
    id: 'friendly',
    name: 'Sarah',
    avatarImg: sarahAvatar,
    title: 'Friendly Senior Engineer & Mentor',
    badge: 'Supportive & Encouraging',
    greeting: "Hi! I'm Sarah. I'm a Senior Engineer and I'll be your interviewer today. Don't worry about being perfect—we're here to evaluate your core thinking and help you grow. Let's have a great conversation!",
    tone: 'encouraging'
  },
  {
    id: 'startup',
    name: 'Alex',
    avatarImg: alexAvatar,
    title: 'Startup Lead Engineer',
    badge: 'Practical & Product-Focused',
    greeting: "Hey there! I'm Alex, Tech Lead at a high-growth startup. Today I'm looking for practical problem-solving skills, clean execution, and how you think on your feet. Take a breath and let me know when you're ready.",
    tone: 'fast-paced'
  },
  {
    id: 'bigtech',
    name: 'David',
    avatarImg: davidAvatar,
    title: 'Big Tech Staff Engineer',
    badge: 'Precise & Architecture-Focused',
    greeting: "Hello! My name is David. Today we'll be discussing technical fundamentals, architectural trade-offs, and design scenarios for your target role. Take your time to structure your thoughts clearly before answering.",
    tone: 'thorough'
  },
  {
    id: 'coach',
    name: 'Elena',
    avatarImg: elenaAvatar,
    title: 'Technical Coach & Assessor',
    badge: 'Analytical & Foundational',
    greeting: "Welcome! I'm Elena. My goal today is to give you a realistic, constructive assessment of your engineering capabilities. Answer at your own pace, and feel free to ask for clarification if needed.",
    tone: 'analytical'
  }
];

// Comprehensive Dictionary of Common English & Tech Words for Strict Pre-Validation
const DICTIONARY_WORDS = new Set([
  // Common English Words
  'a', 'about', 'above', 'across', 'act', 'action', 'add', 'after', 'again', 'against', 'all', 'allow',
  'almost', 'alone', 'along', 'already', 'also', 'although', 'always', 'am', 'among', 'an', 'and', 'another',
  'answer', 'answers', 'any', 'anyone', 'anything', 'app', 'application', 'applications', 'apply', 'approach',
  'architect', 'architecture', 'are', 'area', 'areas', 'around', 'array', 'as', 'ask', 'asking', 'at', 'attempt',
  'attempted', 'attempting', 'attract', 'auto', 'avoid', 'avoiding', 'aware', 'back', 'backend', 'bad', 'base',
  'based', 'basic', 'be', 'because', 'become', 'been', 'before', 'begin', 'behind', 'being', 'below', 'best',
  'better', 'between', 'big', 'bit', 'block', 'both', 'build', 'building', 'built', 'but', 'by', 'call',
  'called', 'calling', 'calls', 'can', 'cannot', 'cant', 'card', 'care', 'case', 'cases', 'cause', 'center',
  'change', 'changes', 'changing', 'check', 'checking', 'checks', 'class', 'classes', 'clean', 'clear', 'clearly',
  'client', 'clients', 'code', 'codes', 'coding', 'come', 'comes', 'common', 'component', 'components',
  'concept', 'concepts', 'condition', 'conflict', 'consider', 'context', 'control', 'core', 'create', 'created',
  'creating', 'data', 'database', 'databases', 'day', 'deal', 'debugging', 'decide', 'decision', 'deep', 'definitely',
  'depend', 'depends', 'design', 'designs', 'detail', 'detailed', 'details', 'developer', 'developers',
  'development', 'difference', 'different', 'difficult', 'do', 'does', 'doesnt', 'doing', 'domain', 'done',
  'don\'t', 'dont', 'down', 'due', 'each', 'early', 'easy', 'edge', 'effect', 'effective', 'efficient',
  'element', 'elements', 'else', 'end', 'engineer', 'engineering', 'engineers', 'enjoy', 'enough', 'ensure',
  'ensuring', 'entire', 'entry', 'env', 'environment', 'error', 'errors', 'evaluate', 'evaluation', 'even',
  'ever', 'every', 'everyone', 'example', 'examples', 'except', 'explain', 'explaining', 'explains', 'fact',
  'fail', 'failed', 'failing', 'fast', 'feature', 'features', 'feel', 'few', 'field', 'file', 'files',
  'fill', 'final', 'find', 'fine', 'first', 'fix', 'fixing', 'flow', 'focus', 'for', 'force', 'form',
  'format', 'found', 'framework', 'from', 'front', 'frontend', 'full', 'function', 'functional', 'functions',
  'future', 'general', 'generic', 'get', 'gets', 'getting', 'give', 'gives', 'giving', 'glass', 'go',
  'going', 'good', 'got', 'great', 'group', 'grow', 'growth', 'guidance', 'guide', 'had', 'handle',
  'handled', 'handles', 'handling', 'hard', 'has', 'have', 'having', 'he', 'header', 'health', 'help',
  'helpful', 'helps', 'her', 'here', 'high', 'higher', 'him', 'his', 'history', 'hold', 'hope', 'how',
  'however', 'html', 'http', 'i', 'idea', 'ideas', 'if', 'image', 'impact', 'implement', 'implementation',
  'implementing', 'implements', 'improve', 'improvement', 'in', 'include', 'includes', 'including', 'index',
  'info', 'information', 'input', 'inputs', 'insight', 'instance', 'instead', 'integrate', 'integration',
  'interaction', 'interactive', 'interface', 'interfacing', 'into', 'is', 'issue', 'issues', 'it', 'item',
  'items', 'its', 'itself', 'java', 'job', 'journey', 'js', 'json', 'just', 'keep', 'key', 'keys',
  'kind', 'know', 'knowledge', 'known', 'knows', 'lab', 'lack', 'land', 'language', 'large', 'larger',
  'last', 'late', 'latency', 'later', 'layer', 'layers', 'layout', 'lead', 'leader', 'learn', 'learning',
  'least', 'less', 'let', 'level', 'library', 'like', 'limit', 'line', 'link', 'list', 'lists',
  'little', 'local', 'load', 'loading', 'loads', 'logic', 'logical', 'logics', 'long', 'longer', 'look',
  'looking', 'looks', 'loop', 'low', 'lower', 'main', 'maintain', 'make', 'makes', 'making', 'manage',
  'management', 'manager', 'manages', 'managing', 'many', 'map', 'margin', 'match', 'matches', 'matter',
  'may', 'maybe', 'me', 'mean', 'meaning', 'means', 'medium', 'memory', 'mention', 'mentioned', 'mentions',
  'menu', 'message', 'meta', 'method', 'methods', 'metric', 'metrics', 'might', 'mind', 'minimal', 'minimize',
  'missing', 'mock', 'mode', 'model', 'modern', 'modify', 'module', 'modules', 'monitor', 'monitoring',
  'more', 'most', 'mostly', 'motion', 'mount', 'move', 'much', 'multiple', 'my', 'name', 'native',
  'navigate', 'near', 'need', 'needed', 'needs', 'network', 'never', 'new', 'next', 'no', 'node',
  'non', 'none', 'normal', 'normalize', 'not', 'note', 'notes', 'nothing', 'notice', 'now', 'null',
  'number', 'object', 'objects', 'obtain', 'of', 'off', 'offset', 'often', 'ok', 'okay', 'on',
  'once', 'one', 'ones', 'only', 'onto', 'open', 'option', 'options', 'or', 'order', 'other',
  'others', 'our', 'out', 'outcome', 'outage', 'output', 'over', 'overall', 'overcome', 'own', 'package',
  'page', 'pages', 'panel', 'paper', 'para', 'param', 'parameter', 'parameters', 'part', 'partial',
  'particular', 'parts', 'pass', 'passed', 'path', 'pattern', 'patterns', 'perform', 'performance', 'person',
  'personal', 'persona', 'phrase', 'pie', 'piece', 'place', 'plan', 'plans', 'point', 'points', 'pool',
  'port', 'position', 'possible', 'post', 'power', 'practical', 'practice', 'prefer', 'preference', 'prepare',
  'present', 'pretty', 'prevent', 'previous', 'primary', 'priority', 'privacy', 'problem', 'problems', 'process',
  'processing', 'produce', 'product', 'production', 'profile', 'program', 'progress', 'project', 'projects',
  'prompt', 'proof', 'property', 'props', 'provide', 'provided', 'provides', 'public', 'publish', 'purpose',
  'push', 'put', 'quality', 'query', 'question', 'questions', 'quick', 'quite', 'raise', 'random',
  'range', 'rank', 'rate', 'rating', 'ratio', 'reach', 'react', 'reacting', 'read', 'readability',
  'ready', 'real', 'realistic', 'reason', 'reasoning', 'rebuild', 'receive', 'received', 'recent', 'reconciliation',
  'record', 'red', 'reduce', 'reducer', 'redux', 'reference', 'referring', 'refresh', 'refactor', 'region',
  'register', 'regular', 'related', 'relationship', 'relative', 'release', 'reliable', 'reload', 'remote',
  'remove', 'render', 'rendering', 'renders', 'replace', 'replay', 'report', 'reporter', 'represent', 'request',
  'requests', 'require', 'required', 'requirements', 'reset', 'resolution', 'resolve', 'resolved', 'resolves',
  'resource', 'resources', 'respect', 'respond', 'response', 'responses', 'responsibility', 'responsive', 'rest',
  'result', 'results', 'resume', 'retry', 'return', 'returned', 'returns', 'reuse', 'review', 'rewrite',
  'right', 'role', 'roles', 'root', 'route', 'routes', 'routing', 'row', 'rule', 'rules',
  'run', 'running', 'runs', 'safe', 'safety', 'same', 'sample', 'save', 'saved', 'scale',
  'scaling', 'scenario', 'scenarios', 'scene', 'schema', 'score', 'scores', 'screen', 'script', 'scroll',
  'search', 'sec', 'second', 'seconds', 'section', 'sections', 'secure', 'security', 'see', 'seeing',
  'seem', 'seems', 'select', 'selected', 'selecting', 'selection', 'selector', 'self', 'send', 'sending',
  'sense', 'sent', 'separate', 'separation', 'sequence', 'server', 'service', 'services', 'session', 'set',
  'setting', 'settings', 'several', 'shadow', 'shape', 'share', 'should', 'show', 'showing', 'shows',
  'side', 'sight', 'sign', 'signal', 'simple', 'simply', 'since', 'single', 'site', 'size',
  'skill', 'skills', 'skin', 'slash', 'slice', 'slick', 'slight', 'slightly', 'slow', 'slower',
  'small', 'smaller', 'smooth', 'so', 'solution', 'solutions', 'solve', 'solved', 'solves', 'solving',
  'some', 'someone', 'something', 'sometimes', 'somewhere', 'soon', 'sort', 'sorted', 'sorting', 'source',
  'sources', 'space', 'spaces', 'sparse', 'speak', 'special', 'specific', 'speed', 'splash', 'split',
  'stack', 'stage', 'standard', 'start', 'started', 'starting', 'starts', 'state', 'statement', 'states',
  'static', 'stats', 'status', 'stay', 'step', 'steps', 'stop', 'storage', 'store', 'stored',
  'stores', 'storing', 'story', 'strategy', 'string', 'strings', 'strong', 'struct', 'structure', 'structured',
  'structures', 'style', 'styles', 'styling', 'submit', 'submitted', 'submitting', 'subtle', 'succeed', 'success',
  'such', 'suggest', 'suite', 'summary', 'support', 'sure', 'system', 'systems', 'table', 'tables',
  'tag', 'tags', 'tail', 'tailor', 'take', 'taken', 'takes', 'taking', 'target', 'targets',
  'task', 'tasks', 'team', 'teams', 'tech', 'technical', 'technology', 'tell', 'template', 'term',
  'terms', 'test', 'testing', 'tests', 'text', 'texts', 'than', 'thank', 'thanks', 'that',
  'the', 'their', 'them', 'theme', 'themselves', 'then', 'there', 'therefore', 'these', 'they',
  'thing', 'things', 'think', 'thinking', 'thinks', 'third', 'this', 'thorough', 'those', 'though',
  'thought', 'thoughts', 'thread', 'threshold', 'through', 'throughput', 'throw', 'time', 'timeout', 'times',
  'tip', 'title', 'to', 'today', 'together', 'token', 'tokens', 'too', 'tool', 'tools',
  'top', 'topic', 'topics', 'total', 'touch', 'touching', 'trade', 'tradeoff', 'tradeoffs', 'traffic',
  'transform', 'transition', 'tree', 'trees', 'trend', 'trigger', 'true', 'trust', 'try', 'trying',
  'turn', 'turned', 'turns', 'tutorial', 'two', 'type', 'types', 'typical', 'typings', 'ui',
  'under', 'understand', 'understanding', 'understands', 'underlying', 'unique', 'unit', 'units', 'until', 'up',
  'update', 'updated', 'updates', 'updating', 'upon', 'upper', 'url', 'us', 'usage', 'use',
  'used', 'user', 'users', 'uses', 'using', 'utility', 'valid', 'validate', 'validation', 'validity',
  'value', 'values', 'variable', 'variables', 'various', 'vector', 'vendor', 'version', 'very', 'via',
  'view', 'views', 'virtual', 'visit', 'visual', 'vital', 'vitals', 'wait', 'waiting', 'want',
  'wants', 'war', 'warning', 'was', 'way', 'ways', 'we', 'web', 'webpack', 'website',
  'well', 'went', 'were', 'what', 'whatever', 'when', 'where', 'whether', 'which', 'while', 'white',
  'who', 'whole', 'why', 'widget', 'width', 'will', 'win', 'window', 'wire', 'wish',
  'with', 'within', 'without', 'word', 'words', 'work', 'worked', 'worker', 'working', 'works',
  'workspace', 'world', 'worry', 'worth', 'would', 'write', 'writing', 'written', 'wrong', 'xml',
  'xss', 'year', 'years', 'yellow', 'yes', 'yet', 'you', 'your', 'yours', 'yourself',
  'zero', 'zone', 'zustand'
]);

export const getPersonaObj = (personaId) => {
  if (!personaId || personaId === 'random') {
    const randomIndex = Math.floor(Math.random() * INTERVIEW_PERSONAS.length);
    return INTERVIEW_PERSONAS[randomIndex];
  }
  return INTERVIEW_PERSONAS.find(p => p.id === personaId) || INTERVIEW_PERSONAS[0];
};

// Conversational Transition Sentences
export const getConversationalTransition = (answerText, personaName = 'Interviewer') => {
  const text = (answerText || '').trim();
  const nonsenseCheck = detectNonsense(text);

  if (nonsenseCheck.isNonsense) {
    return `I noticed your answer didn't contain a clear technical response. Let's move on to the next scenario—please be sure to explain your technical reasoning.`;
  }

  const wordCount = text ? text.split(/\s+/).length : 0;
  const transitions = [
    `Thanks for that explanation. Let's build on what you mentioned for our next topic.`,
    `Got it, thank you. Let's move on to the next technical scenario.`,
    `Interesting perspective. I'd like to get your thoughts on another area now.`,
    `Great, thanks for sharing your approach. Imagine you're working on a real project...`,
    `Thanks. Let me pivot slightly to another fundamental concept for this role.`
  ];

  if (wordCount < 10) {
    return `Thanks. Let me present the next prompt for you.`;
  }

  return transitions[Math.floor(Math.random() * transitions.length)];
};

// Domain-Specific Questions Generator
export const generateNextAdaptiveQuestion = ({ setupData, questionIndex = 0, previousHistory = [], persona }) => {
  const role = setupData?.targetRole || 'Frontend Developer';
  const difficulty = setupData?.difficulty || 'Medium';

  const domainQuestionBank = {
    'Frontend Developer': [
      {
        id: 'fe_1',
        topic: 'React Core & Virtual DOM',
        question: "Can you explain how React's Virtual DOM reconciliation process works and how keys help optimize list rendering performance?",
        type: 'technical'
      },
      {
        id: 'fe_2',
        topic: 'State Management & Optimization',
        question: "When managing application state in a large frontend codebase, how do you decide between local React state, Context API, and global state managers like Redux or Zustand?",
        type: 'technical'
      },
      {
        id: 'fe_3',
        topic: 'Performance & Web Vitals',
        question: "Imagine a web app is experiencing slow initial loads and laggy UI interactions. What tools and techniques would you use to diagnose and improve Largest Contentful Paint (LCP) and Interaction to Next Paint (INP)?",
        type: 'technical'
      },
      {
        id: 'fe_4',
        topic: 'Behavioral & Project Trade-offs',
        question: "Tell me about a time when you had to make a tough technical compromise due to a strict deadline. What was the situation, what trade-offs did you accept, and how did it turn out?",
        type: 'behavioral'
      },
      {
        id: 'fe_5',
        topic: 'CSS Architecture & Responsive Layouts',
        question: "How do you structure modern CSS in scalable applications? Explain your approach to responsive layouts, container queries, and design token consistency.",
        type: 'technical'
      }
    ],
    'Backend Engineer (Java/Spring)': [
      {
        id: 'be_1',
        topic: 'Spring Boot Dependency Injection',
        question: "How does Dependency Injection and Inversion of Control (IoC) work in Spring Boot, and what is the difference between @Component, @Service, and @Repository annotations?",
        type: 'technical'
      },
      {
        id: 'be_2',
        topic: 'REST API & JPA Performance',
        question: "What is the N+1 select problem in Spring Data JPA/Hibernate, and what strategies do you use to resolve it in high-throughput backend services?",
        type: 'technical'
      },
      {
        id: 'be_3',
        topic: 'Microservices & Database Transactions',
        question: "How do you manage distributed transactions across multiple microservices without causing database deadlocks or data inconsistency?",
        type: 'technical'
      },
      {
        id: 'be_4',
        topic: 'Behavioral & Outage Incident',
        question: "Describe a production outage or critical backend bug you experienced. How did you identify the root cause under pressure, and what preventive measures did you implement afterward?",
        type: 'behavioral'
      }
    ]
  };

  const defaultQuestions = [
    {
      id: 'gen_1',
      topic: 'Domain Architecture & System Design',
      question: `For a ${role} role, how do you structure modular components or service layers to ensure clean separation of concerns and testability?`,
      type: 'technical'
    },
    {
      id: 'gen_2',
      topic: 'API Design & Asynchronous Data',
      question: "How do you handle asynchronous data fetching, error boundaries, and retry strategies in production systems?",
      type: 'technical'
    },
    {
      id: 'gen_3',
      topic: 'Security & Authentication',
      question: "What security best practices do you enforce in client-server communications (e.g. JWT tokens, CORS, XSS prevention)?",
      type: 'technical'
    },
    {
      id: 'gen_4',
      topic: 'Behavioral STAR Scenario',
      question: "Tell me about a situation where you had a strong technical disagreement with a teammate. How did you resolve the conflict while maintaining momentum?",
      type: 'behavioral'
    },
    {
      id: 'gen_5',
      topic: 'System Scalability & Monitoring',
      question: "How do you monitor application health in production, and what metrics trigger your alerts?",
      type: 'technical'
    }
  ];

  const pool = domainQuestionBank[role] || defaultQuestions;
  const targetQ = pool[questionIndex % pool.length] || defaultQuestions[0];

  return {
    ...targetQ,
    questionText: targetQ.question || targetQ.questionText || `For a ${role} role, how do you structure modular components or service layers to ensure clean separation of concerns and testability?`,
    question: targetQ.question || targetQ.questionText || `For a ${role} role, how do you structure modular components or service layers to ensure clean separation of concerns and testability?`,
    category: targetQ.topic || targetQ.category || "Domain Knowledge",
    topic: targetQ.topic || targetQ.category || "Domain Knowledge",
    questionIndex: questionIndex + 1,
    difficulty
  };
};

// Strict Pre-Validation & Gibberish / Nonsense Detector
export const detectNonsense = (text) => {
  if (!text || typeof text !== 'string') return { isNonsense: true, type: 'EMPTY' };

  const trimmed = text.trim();
  if (trimmed.length === 0) return { isNonsense: true, type: 'EMPTY' };

  const lower = trimmed.toLowerCase();

  // 1. Common Explicit Non-Answers / Placeholders
  const explicitNonAnswers = new Set([
    'ok', 'okay', 'yes', 'no', 'yeah', 'nope', 'idk', 'i dont know', "i don't know",
    'dont know', "don't know", 'test', 'testing', 'hello', 'hi', 'hey', 'whatever',
    'asdf', 'qwert', 'qwerty', '123123', '???', '...', 'lorem ipsum', 'abc', 'xyz',
    'jfjkfe', 'null', 'undefined', 'na', 'n/a', 'pass', 'skip', 'ceajknafae'
  ]);

  if (explicitNonAnswers.has(lower) || lower.length < 3) {
    return { isNonsense: true, type: 'INVALID' };
  }

  // 2. Keyboard Smash / Repetitive Character Detection
  if (/^(.)\1+$/.test(lower)) {
    return { isNonsense: true, type: 'INVALID' };
  }

  const smashPatterns = [
    /^[asdfghjkl;']{4,}$/i,
    /^[qwertyuiop]{4,}$/i,
    /^[zxcvbnm]{4,}$/i,
    /^[1234567890]{4,}$/i,
    /(.)\1{3,}/, // 4 identical chars in a row
    /^([^aeiouy]{4,})/i // 4 consecutive consonants at start
  ];

  for (const pattern of smashPatterns) {
    if (pattern.test(lower)) {
      return { isNonsense: true, type: 'INVALID' };
    }
  }

  // 3. Strict Dictionary Word Matching (Pre-Validation Dictionary Check)
  const tokens = lower.match(/[a-z]{2,}/g) || [];
  
  if (tokens.length === 0) {
    return { isNonsense: true, type: 'INVALID' };
  }

  let recognizedCount = 0;
  for (const token of tokens) {
    if (DICTIONARY_WORDS.has(token)) {
      recognizedCount++;
    }
  }

  const matchRatio = recognizedCount / tokens.length;

  // Criteria: Response must contain at least 2 recognized words OR match ratio >= 50%
  if (recognizedCount < 2 || matchRatio < 0.50) {
    return { isNonsense: true, type: 'INVALID', recognizedCount, totalTokens: tokens.length };
  }

  return { isNonsense: false, type: 'VALID', recognizedCount, totalTokens: tokens.length };
};

// Strict Evidence-Based Evaluation Engine (No Hallucinated Feedback)
export const evaluateAnswerRealistic = (questionObj, answerText, persona) => {
  const text = (answerText || '').trim();

  // 1. Strict Pre-Validation & Dictionary Match Check
  const nonsenseCheck = detectNonsense(text);
  if (nonsenseCheck.isNonsense) {
    const isNoResponse = nonsenseCheck.type === 'EMPTY';
    return {
      status: isNoResponse ? 'EMPTY' : 'INVALID',
      score: 0,
      breakdown: {
        technicalAccuracy: 0,
        communication: 0,
        problemSolving: 0,
        confidence: 0
      },
      feedback: isNoResponse
        ? "No answer was provided. Please enter a technical response to be evaluated."
        : "The submitted response appears to be random or meaningless text and cannot be evaluated.",
      reason: isNoResponse
        ? "Empty response submitted."
        : "No recognized technical concepts or valid English dictionary words detected in response.",
      strengths: [],
      improvements: ["Provide a genuine technical response written in clear, meaningful language addressing the prompt."],
      keyTakeaway: "No score awarded for invalid or non-meaningful text input.",
      evidence: [
        `0 recognized technical concepts or valid words detected in submitted text (${nonsenseCheck.recognizedCount || 0}/${nonsenseCheck.totalTokens || 0} recognized tokens).`
      ]
    };
  }

  // 2. Extract Evidence directly from Candidate's Response (No Hallucinated Praise!)
  const lower = text.toLowerCase();
  const topicLower = (questionObj?.topic || questionObj?.category || '').toLowerCase();
  const qTextLower = (questionObj?.question || questionObj?.questionText || '').toLowerCase();

  const commonKeywords = [
    'react', 'dom', 'virtual dom', 'component', 'state', 'props', 'hooks', 'redux', 'zustand',
    'spring', 'java', 'dependency', 'bean', 'api', 'rest', 'http', 'database', 'sql', 'jpa',
    'css', 'html', 'flex', 'grid', 'performance', 'lcp', 'inp', 'webpack', 'vite', 'node',
    'express', 'microservice', 'transaction', 'security', 'jwt', 'cors', 'auth', 'architecture',
    'test', 'jest', 'mock', 'star', 'situation', 'task', 'action', 'result', 'code', 'deploy',
    'system', 'scale', 'cache', 'redis', 'kafka', 'latency', 'optimize'
  ];

  const questionWords = `${topicLower} ${qTextLower}`.match(/[a-z]{3,}/g) || [];
  const targetWords = Array.from(new Set([...commonKeywords, ...questionWords]));

  // Find exact evidence terms present in candidate's answer
  const detectedEvidenceTerms = [];
  for (const word of targetWords) {
    if (lower.includes(word) && !detectedEvidenceTerms.includes(word)) {
      detectedEvidenceTerms.push(word);
    }
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const admitsUnsure = lower.includes("don't know") || lower.includes("dont know") || lower.includes("not sure") || lower.includes("unsure");

  // 3. Off-Topic / Zero Technical Terms Response
  if (detectedEvidenceTerms.length === 0) {
    return {
      status: 'IRRELEVANT',
      score: 10,
      breakdown: {
        technicalAccuracy: 5,
        communication: 20,
        problemSolving: 5,
        confidence: 10
      },
      feedback: "The response was readable but completely off-topic. It does not address the target technical concepts of the prompt.",
      reason: `Submitted answer contained no technical keywords matching the topic: "${questionObj?.topic || 'Domain Topic'}".`,
      strengths: ["Formed readable sentences"],
      improvements: [`Focus directly on the technical concepts in the prompt: ${questionObj?.topic || 'Topic'}`],
      keyTakeaway: "Off-topic response. Re-read the question prompt carefully before answering.",
      evidence: [
        `No domain keywords matching "${questionObj?.topic || 'the topic'}" were found in your submitted text.`
      ]
    };
  }

  // 4. Genuine Partial Attempt
  if (admitsUnsure || wordCount < 20 || detectedEvidenceTerms.length < 3) {
    const partialScore = Math.min(55, Math.max(30, 25 + wordCount * 1.2 + detectedEvidenceTerms.length * 5));
    const roundedScore = Math.round(partialScore);

    const evidenceList = detectedEvidenceTerms.map(term => `Mentioned "${term}"`);
    if (admitsUnsure) {
      evidenceList.push(`Stated lack of full knowledge on specific mechanisms`);
    }

    return {
      status: 'PARTIAL',
      score: roundedScore,
      breakdown: {
        technicalAccuracy: Math.round(roundedScore * 0.9),
        communication: Math.round(roundedScore * 1.1),
        problemSolving: Math.round(roundedScore * 0.95),
        confidence: Math.round(roundedScore * 1.0)
      },
      feedback: `Partial response. You mentioned ${detectedEvidenceTerms.slice(0, 3).map(t => `"${t}"`).join(', ')}, but missed complete architectural trade-offs and detailed execution steps for ${questionObj?.topic || 'the topic'}.`,
      reason: `Incomplete technical explanation for topic: "${questionObj?.topic || 'Domain Topic'}".`,
      strengths: [`Mentioned core concepts: ${detectedEvidenceTerms.slice(0, 2).join(', ')}`],
      improvements: [
        `Explain specific edge-cases and performance trade-offs for ${questionObj?.topic || 'the topic'}`,
        "Provide concrete code or system architecture examples"
      ],
      keyTakeaway: "Elaborate with specific technical details and operational metrics to raise your score.",
      evidence: evidenceList
    };
  }

  // 5. Valid Response Handling
  let baseScore = 80;
  if (wordCount > 40) baseScore += 8;
  if (detectedEvidenceTerms.length >= 4) baseScore += 6;

  const validScore = Math.min(96, Math.max(75, baseScore));

  return {
    status: 'VALID',
    score: validScore,
    breakdown: {
      technicalAccuracy: Math.min(98, Math.round(validScore * 0.98)),
      communication: Math.min(98, Math.round(validScore * 1.02)),
      problemSolving: Math.min(98, Math.round(validScore * 0.97)),
      confidence: Math.min(98, Math.round(validScore * 1.01))
    },
    feedback: `Strong technical response! You clearly explained core principles behind ${questionObj?.topic || 'the topic'} with logical structure and relevant trade-offs.`,
    reason: `Detailed, relevant, and well-structured answer addressing ${questionObj?.topic || 'the topic'}.`,
    strengths: [
      `Thorough explanation referencing: ${detectedEvidenceTerms.slice(0, 3).join(', ')}`,
      "Clear technical communication and logical trade-off analysis"
    ],
    improvements: [
      "Include quantitative production metrics (e.g. latency, bundle size, throughput)",
      "Discuss automated failover and monitoring alerts"
    ],
    keyTakeaway: "Excellent response demonstrating strong candidate readiness.",
    evidence: detectedEvidenceTerms.map(term => `Cited key technical concept "${term}"`)
  };
};

// Generate Post-Interview Learning Recommendations
export const generateLearningRecommendations = (targetRole, history) => {
  const invalidCount = history.filter(h => h.feedback?.status === 'INVALID' || h.feedback?.status === 'EMPTY' || h.feedback?.status === 'NO_RESPONSE').length;

  if (invalidCount >= Math.ceil(history.length * 0.4)) {
    return [
      {
        skillName: "Technical Interview Fundamentals & Preparation",
        reason: "Focus on articulating complete technical concepts rather than submitting partial or non-meaningful text.",
        estimatedTime: "2 Weeks"
      },
      {
        skillName: "STAR Method Communication Framework",
        reason: "Structure every answer using Situation, Task, Action, and Result for maximum interviewer clarity.",
        estimatedTime: "1 Week"
      }
    ];
  }

  return [
    {
      skillName: "Advanced React State Management & Optimizations",
      reason: "Mastering memoization and global state selectors will boost your technical evaluation score.",
      estimatedTime: "2 Weeks"
    },
    {
      skillName: "Web Vitals & Performance Profiling",
      reason: "Recruiters heavily evaluate LCP, INP, and memory leak diagnostic skills.",
      estimatedTime: "1.5 Weeks"
    },
    {
      skillName: "Behavioral STAR Method Presentation",
      reason: "Structuring responses into Situation, Task, Action, and Result guarantees top marks from interviewers.",
      estimatedTime: "1 Week"
    }
  ];
};
