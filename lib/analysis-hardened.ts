import { ExtractedSkills, SkillCategory, SKILL_CATEGORIES, getActiveCategories, hasExtractedSkills, handleEmptySkills } from "./skills-hardened";

export interface RoundChecklist {
  round: number;
  title: string;
  items: string[];
}

export interface DayPlan {
  day: number;
  title: string;
  tasks: string[];
}

export interface AnalysisResult {
  extractedSkills: ExtractedSkills;
  activeCategories: SkillCategory[];
  checklist: RoundChecklist[];
  plan: DayPlan[];
  questions: string[];
  baseScore: number;
  // Deprecated fields (kept for backward compatibility)
  readinessScore?: number;
  generalFresherStack?: boolean;
}

// Generate round-wise checklist based on detected skills
function generateChecklist(skills: ExtractedSkills, activeCategories: SkillCategory[]): RoundChecklist[] {
  const checklist: RoundChecklist[] = [];

  // Round 1: Aptitude / Basics
  const round1Items = [
    "Practice quantitative aptitude problems (percentages, ratios, time-speed-distance)",
    "Solve logical reasoning puzzles (patterns, series, coding-decoding)",
    "Review verbal ability (grammar, comprehension, vocabulary)",
    "Take 2-3 mock aptitude tests under timed conditions",
    "Brush up on basic mathematics (probability, permutations, statistics)",
  ];
  checklist.push({
    round: 1,
    title: "Aptitude / Basics",
    items: round1Items,
  });

  // Round 2: DSA + Core CS
  const round2Items = [
    "Review fundamental data structures (arrays, linked lists, stacks, queues)",
    "Practice tree and graph algorithms (BFS, DFS, traversals)",
    "Solve 5-10 problems on dynamic programming",
    "Review sorting and searching algorithms with complexity analysis",
    skills.coreCS.includes("OOP") ? "Deep dive into OOP concepts (inheritance, polymorphism, encapsulation)" : "Study basic OOP principles",
    skills.coreCS.includes("DBMS") ? "Practice SQL queries (joins, subqueries, normalization)" : "Learn basic database concepts",
    "Prepare for system design basics (scalability, load balancing)",
    "Review time and space complexity analysis (Big O notation)",
  ];
  checklist.push({
    round: 2,
    title: "DSA + Core CS",
    items: round2Items,
  });

  // Round 3: Tech interview (projects + stack)
  const round3Items: string[] = [
    "Prepare detailed explanation of your top 2 projects",
    "Document your role and contributions in each project",
  ];

  // Add stack-specific items
  if (skills.languages.length > 0) {
    round3Items.push(`Deep dive into ${skills.languages.slice(0, 2).join(", ")} - syntax, features, best practices`);
  }
  if (skills.web.length > 0) {
    round3Items.push(`Study ${skills.web.slice(0, 2).join(", ")} concepts and practical applications`);
  }
  if (skills.data.includes("SQL") || skills.data.length > 0) {
    round3Items.push("Prepare database design questions and optimization techniques");
  }
  if (skills.cloud.length > 0) {
    round3Items.push(`Understand ${skills.cloud.slice(0, 2).join(", ")} basics and use cases`);
  }
  if (skills.other.length > 0) {
    round3Items.push("Focus on communication and problem-solving skills");
    round3Items.push("Prepare to discuss your projects and approach to challenges");
  }

  round3Items.push(
    "Review REST API design principles and best practices",
    "Prepare to explain your approach to debugging and problem-solving",
    "Practice coding on a whiteboard or paper without IDE assistance"
  );

  checklist.push({
    round: 3,
    title: "Tech Interview (Projects + Stack)",
    items: round3Items.slice(0, 8),
  });

  // Round 4: Managerial / HR
  const round4Items = [
    "Prepare STAR-format answers for behavioral questions",
    "Research the company thoroughly (products, culture, recent news)",
    "Prepare 'Tell me about yourself' pitch (2-minute version)",
    "Practice 'Why do you want to join this company?' response",
    "Prepare questions to ask the interviewer",
    "Review your resume thoroughly - every point should be explainable",
    "Practice salary negotiation basics",
    "Prepare for situational questions (conflict resolution, leadership)",
  ];
  checklist.push({
    round: 4,
    title: "Managerial / HR",
    items: round4Items,
  });

  return checklist;
}

// Generate 7-day plan based on detected skills
function generatePlan(skills: ExtractedSkills, activeCategories: SkillCategory[]): DayPlan[] {
  const plan: DayPlan[] = [];

  // Day 1-2: Basics + Core CS
  const day1Tasks = [
    "Review aptitude formulas and shortcuts",
    "Solve 20 aptitude problems (mixed topics)",
    skills.coreCS.includes("DSA") ? "Revise arrays and linked list operations" : "Study basic data structures",
    skills.coreCS.includes("OOP") ? "Review OOP principles with examples" : "Learn OOP basics",
  ];
  plan.push({ day: 1, title: "Basics + Core CS - Part 1", tasks: day1Tasks });

  const day2Tasks = [
    "Practice verbal ability exercises",
    "Take a full mock aptitude test",
    skills.coreCS.includes("DBMS") ? "Study SQL joins and normalization" : "Learn database fundamentals",
    skills.coreCS.includes("OS") ? "Review OS concepts (processes, memory, scheduling)" : "Study OS basics",
  ];
  plan.push({ day: 2, title: "Basics + Core CS - Part 2", tasks: day2Tasks });

  // Day 3-4: DSA + Coding Practice
  const day3Tasks = [
    "Solve 5 easy DSA problems on arrays and strings",
    "Practice tree traversals (in-order, pre-order, post-order)",
    "Review recursion concepts and solve 2 recursion problems",
    skills.languages.length > 0 ? `Practice coding in ${skills.languages[0]}` : "Practice coding in your preferred language",
  ];
  plan.push({ day: 3, title: "DSA + Coding Practice - Part 1", tasks: day3Tasks });

  const day4Tasks = [
    "Solve 5 medium DSA problems (graphs, dynamic programming)",
    "Practice graph algorithms (BFS, DFS, shortest path)",
    "Review sorting algorithms and their complexities",
    "Solve 2 problems on dynamic programming",
  ];
  plan.push({ day: 4, title: "DSA + Coding Practice - Part 2", tasks: day4Tasks });

  // Day 5: Project + Resume Alignment
  const day5Tasks = [
    "Polish your resume - ensure all projects are well-documented",
    "Prepare project explanations (problem, solution, your role, technologies)",
    skills.web.length > 0 ? `Review ${skills.web[0]} concepts and practical applications` : "Study web development basics",
    "Create a list of your key achievements and metrics",
    "Prepare answers for 'Walk me through your resume'",
  ];
  plan.push({ day: 5, title: "Project + Resume Alignment", tasks: day5Tasks });

  // Day 6: Mock Interview Questions
  const day6Tasks = [
    "Practice 10 technical questions out loud",
    "Do a mock coding interview with a friend or use Pramp",
    "Review common HR questions and prepare STAR responses",
    skills.data.length > 0 ? "Practice database design and SQL query questions" : "Study data management basics",
    "Record yourself answering questions and review",
  ];
  plan.push({ day: 6, title: "Mock Interview Questions", tasks: day6Tasks });

  // Day 7: Revision + Weak Areas
  const day7Tasks = [
    "Review all notes and key concepts from the week",
    "Identify and work on your weak areas",
    "Take one final mock test (aptitude + technical)",
    "Prepare your interview attire and documents",
    "Relax and get a good night's sleep before the interview",
  ];
  plan.push({ day: 7, title: "Revision + Weak Areas", tasks: day7Tasks });

  return plan;
}

// Generate likely interview questions based on detected skills
function generateQuestions(skills: ExtractedSkills, activeCategories: SkillCategory[]): string[] {
  const questions: string[] = [];

  // Core CS questions
  if (skills.coreCS.includes("DSA")) {
    questions.push("How would you optimize search in sorted data?");
    questions.push("Explain the difference between BFS and DFS with use cases.");
    questions.push("What is dynamic programming and when would you use it?");
    questions.push("Compare different sorting algorithms and their time complexities.");
  }

  if (skills.coreCS.includes("OOP")) {
    questions.push("Explain the four pillars of OOP with real-world examples.");
    questions.push("What is the difference between abstraction and encapsulation?");
    questions.push("Explain polymorphism and its types.");
  }

  if (skills.coreCS.includes("DBMS")) {
    questions.push("Explain database normalization and its different forms.");
    questions.push("What is the difference between INNER JOIN and LEFT JOIN?");
  }

  // Language-specific questions
  if (skills.languages.includes("Java")) {
    questions.push("Explain the difference between String, StringBuilder, and StringBuffer in Java.");
    questions.push("What is the difference between abstract classes and interfaces in Java?");
  }

  if (skills.languages.includes("Python")) {
    questions.push("Explain list comprehensions in Python with examples.");
    questions.push("What are decorators in Python and how do they work?");
  }

  if (skills.languages.includes("JavaScript") || skills.languages.includes("TypeScript")) {
    questions.push("Explain closures in JavaScript and provide an example.");
    questions.push("What is the event loop in JavaScript?");
    questions.push("Explain the difference between let, const, and var.");
  }

  // Web development questions
  if (skills.web.includes("React")) {
    questions.push("Explain state management options in React.");
    questions.push("What is the virtual DOM and how does React use it?");
    questions.push("Explain the lifecycle methods in React (or hooks in functional components).");
  }

  if (skills.web.includes("Node.js")) {
    questions.push("How does Node.js handle asynchronous operations?");
    questions.push("Explain the event-driven architecture of Node.js.");
  }

  if (skills.web.includes("REST")) {
    questions.push("What are RESTful API design principles?");
    questions.push("Explain the difference between PUT and PATCH.");
  }

  // Data questions
  if (skills.data.includes("SQL")) {
    questions.push("Explain indexing and when it helps.");
    questions.push("What is the difference between clustered and non-clustered indexes?");
    questions.push("How would you optimize a slow-running SQL query?");
  }

  if (skills.data.includes("MongoDB")) {
    questions.push("When would you choose MongoDB over a relational database?");
    questions.push("Explain the concept of sharding in MongoDB.");
  }

  // Cloud/DevOps questions
  if (skills.cloud.includes("AWS")) {
    questions.push("Explain the difference between EC2 and Lambda.");
    questions.push("What is auto-scaling and how does it work in AWS?");
  }

  if (skills.cloud.includes("Docker")) {
    questions.push("What is the difference between a Docker image and a container?");
    questions.push("Explain Docker volumes and their use cases.");
  }

  if (skills.cloud.includes("Kubernetes")) {
    questions.push("What are pods in Kubernetes?");
    questions.push("Explain the role of a Kubernetes service.");
  }

  // Testing questions
  if (skills.testing.length > 0) {
    questions.push("What is the difference between unit testing and integration testing?");
    questions.push("Explain the testing pyramid and its significance.");
  }

  // Other skills questions
  if (skills.other.includes("Communication")) {
    questions.push("Describe a time when you had to explain a technical concept to a non-technical person.");
    questions.push("How do you handle disagreements in a team setting?");
  }

  if (skills.other.includes("Problem solving")) {
    questions.push("Walk me through your approach to solving a complex technical problem.");
    questions.push("Tell me about a time you had to debug a difficult issue.");
  }

  if (skills.other.includes("Projects")) {
    questions.push("Tell me about your most challenging project and what you learned from it.");
    questions.push("How do you approach breaking down a large project into manageable tasks?");
  }

  // General questions if few specific ones
  if (questions.length < 5) {
    questions.push("Tell me about a challenging project you worked on and how you overcame obstacles.");
    questions.push("How do you approach debugging a complex issue?");
    questions.push("Explain the difference between TCP and UDP.");
    questions.push("What is your approach to learning new technologies?");
  }

  // Ensure we have at least 10 questions
  const generalQuestions = [
    "Describe a time when you had to work under pressure to meet a deadline.",
    "How do you stay updated with the latest technology trends?",
    "Explain the concept of load balancing and why it's important.",
    "What is your approach to code reviews?",
    "Describe a situation where you had a conflict with a team member and how you resolved it.",
    "What are your strengths and weaknesses as a developer?",
    "Where do you see yourself in 5 years?",
    "Why do you want to join our company?",
    "Do you have any questions for us?",
  ];

  while (questions.length < 10) {
    const nextQuestion = generalQuestions[questions.length % generalQuestions.length];
    if (!questions.includes(nextQuestion)) {
      questions.push(nextQuestion);
    } else {
      break;
    }
  }

  return questions.slice(0, 10);
}

// Calculate base readiness score (computed only on analyze)
function calculateBaseScore(
  skills: ExtractedSkills,
  activeCategories: SkillCategory[],
  company: string,
  role: string,
  jdLength: number
): number {
  let score = 35; // Base score

  // +5 per detected category (max 30)
  const categoryBonus = Math.min(activeCategories.length * 5, 30);
  score += categoryBonus;

  // +10 if company name provided
  if (company && company.trim().length > 0) {
    score += 10;
  }

  // +10 if role provided
  if (role && role.trim().length > 0) {
    score += 10;
  }

  // +10 if JD length > 800 chars
  if (jdLength > 800) {
    score += 10;
  }

  // Cap at 100
  return Math.min(score, 100);
}

// Recalculate final score based on skill confidence (only changes from base)
export function recalculateFinalScore(
  baseScore: number,
  skillConfidenceMap: Record<string, "know" | "practice">
): number {
  let score = baseScore;
  
  // +2 for each "know" skill
  // -2 for each "practice" skill
  Object.values(skillConfidenceMap).forEach(confidence => {
    if (confidence === "know") {
      score += 2;
    } else {
      score -= 2;
    }
  });
  
  // Bound between 0 and 100
  return Math.min(Math.max(score, 0), 100);
}

// Get weak skills (practice-marked skills)
export function getWeakSkills(skillConfidenceMap: Record<string, "know" | "practice">): string[] {
  return Object.entries(skillConfidenceMap)
    .filter(([_, confidence]) => confidence === "practice")
    .map(([skill, _]) => skill);
}

// Validate skill confidence map
export function validateSkillConfidenceMap(
  skillConfidenceMap: Record<string, any>
): skillConfidenceMap is Record<string, "know" | "practice"> {
  const validValues = ["know", "practice"];
  return Object.values(skillConfidenceMap).every(value => validValues.includes(value));
}

// Main analysis function
export function analyzeJD(
  jdText: string,
  company: string,
  role: string
): AnalysisResult {
  // Extract skills from JD
  let extractedSkills = handleEmptySkills(require("./skills-hardened").extractSkills(jdText));
  
  const activeCategories = getActiveCategories(extractedSkills);
  const baseScore = calculateBaseScore(
    extractedSkills,
    activeCategories,
    company,
    role,
    jdText.length
  );

  const checklist = generateChecklist(extractedSkills, activeCategories);
  const plan = generatePlan(extractedSkills, activeCategories);
  const questions = generateQuestions(extractedSkills, activeCategories);

  return {
    extractedSkills,
    activeCategories,
    checklist,
    plan,
    questions,
    baseScore,
  };
}