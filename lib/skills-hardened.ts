// Skill categories with keywords for extraction
export const SKILL_CATEGORIES = {
  coreCS: {
    name: "Core CS",
    keywords: ["DSA", "OOP", "DBMS", "OS", "Networks", "Data Structures", "Algorithms", "Object Oriented", "Database", "Operating System"],
  },
  languages: {
    name: "Languages",
    keywords: ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Go", "Golang", "Ruby", "PHP", "Swift", "Kotlin", "Rust"],
  },
  web: {
    name: "Web Development",
    keywords: ["React", "Next.js", "Node.js", "Express", "REST", "GraphQL", "HTML", "CSS", "Angular", "Vue", "Django", "Flask", "Spring", "Bootstrap", "Tailwind"],
  },
  data: {
    name: "Data & Databases",
    keywords: ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch", "Cassandra", "DynamoDB", "NoSQL", "Oracle"],
  },
  cloud: {
    name: "Cloud & DevOps",
    keywords: ["AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", "CI/CD", "Linux", "Jenkins", "Terraform", "Ansible", "Nginx", "Apache"],
  },
  testing: {
    name: "Testing",
    keywords: ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest", "Jest", "Mocha", "Chai", "Testing", "Automation Testing"],
  },
  other: {
    name: "Other Skills",
    keywords: ["Communication", "Problem solving", "Basic coding", "Projects"],
  },
};

export type SkillCategory = keyof typeof SKILL_CATEGORIES;

export interface ExtractedSkills {
  coreCS: string[];
  languages: string[];
  web: string[];
  data: string[];
  cloud: string[];
  testing: string[];
  other: string[];
}

// Normalize text for comparison
function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9+\s]/g, " ");
}

// Extract skills from JD text
export function extractSkills(jdText: string): ExtractedSkills {
  const normalizedJD = normalizeText(jdText);
  
  const extracted: ExtractedSkills = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: [],
  };

  // Check each category
  (Object.keys(SKILL_CATEGORIES) as SkillCategory[]).forEach((category) => {
    const { keywords } = SKILL_CATEGORIES[category];
    
    keywords.forEach((keyword) => {
      const normalizedKeyword = normalizeText(keyword);
      
      // Check for exact match or word boundary match
      const keywordRegex = new RegExp(
        `\\b${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i"
      );
      
      if (keywordRegex.test(normalizedJD)) {
        // Add original keyword (not normalized) to results
        if (!extracted[category].includes(keyword)) {
          extracted[category].push(keyword);
        }
      }
    });
  });

  return extracted;
}

// Check if any skills were extracted (excluding "other" category)
export function hasExtractedSkills(skills: ExtractedSkills): boolean {
  const categories = Object.keys(skills).filter(cat => cat !== 'other') as SkillCategory[];
  return categories.some((category) => skills[category].length > 0);
}

// Get all extracted skills as flat array
export function getAllSkills(skills: ExtractedSkills): string[] {
  return Object.values(skills).flat();
}

// Get categories that have skills
export function getActiveCategories(skills: ExtractedSkills): SkillCategory[] {
  return (Object.keys(skills) as SkillCategory[]).filter(
    (category) => skills[category].length > 0
  );
}

// Handle fallback for empty skill extraction
export function handleEmptySkills(skills: ExtractedSkills): ExtractedSkills {
  if (!hasExtractedSkills(skills)) {
    // Populate "other" category with default skills
    return {
      ...skills,
      other: ["Communication", "Problem solving", "Basic coding", "Projects"]
    };
  }
  return skills;
}