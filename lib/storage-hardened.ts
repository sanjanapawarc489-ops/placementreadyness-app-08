import { ExtractedSkills } from "./skills";
import { AnalysisResult } from "./analysis";

const STORAGE_KEY = "placement_readiness_history";

// New interfaces for standardized schema
export interface RoundMapping {
  roundTitle: string;
  focusAreas: string[];
  whyItMatters: string;
}

export interface ChecklistItem {
  roundTitle: string;
  items: string[];
}

export interface PlanDay {
  day: number;
  focus: string;
  tasks: string[];
}

export interface HistoryEntry {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: ExtractedSkills;
  roundMapping: RoundMapping[];
  checklist: ChecklistItem[];
  plan7Days: PlanDay[];
  questions: string[];
  baseScore: number;
  skillConfidenceMap: Record<string, "know" | "practice">;
  finalScore: number;
  updatedAt: string;
  // Deprecated fields (kept for backward compatibility)
  plan?: AnalysisResult["plan"];
  generalFresherStack?: boolean;
  readinessScore?: number;
}

// Validation utilities
export function validateHistoryEntry(entry: any): entry is HistoryEntry {
  const requiredFields = [
    'id', 'createdAt', 'company', 'role', 'jdText', 'extractedSkills',
    'roundMapping', 'checklist', 'plan7Days', 'questions', 'baseScore',
    'skillConfidenceMap', 'finalScore', 'updatedAt'
  ];
  
  for (const field of requiredFields) {
    if (!(field in entry)) {
      console.warn(`Missing required field: ${field}`);
      return false;
    }
  }
  
  // Validate skillConfidenceMap structure
  if (typeof entry.skillConfidenceMap !== 'object') {
    console.warn('Invalid skillConfidenceMap structure');
    return false;
  }
  
  // Validate confidence values
  const validConfidenceValues = ['know', 'practice'];
  for (const [skill, confidence] of Object.entries(entry.skillConfidenceMap)) {
    if (!validConfidenceValues.includes(confidence as string)) {
      console.warn(`Invalid confidence value for skill ${skill}: ${confidence}`);
      return false;
    }
  }
  
  return true;
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Initialize skill confidence map with all skills set to "practice"
export function initializeSkillConfidenceMap(skills: ExtractedSkills): Record<string, "know" | "practice"> {
  const confidenceMap: Record<string, "know" | "practice"> = {};
  Object.values(skills).flat().forEach(skill => {
    confidenceMap[skill] = "practice";
  });
  return confidenceMap;
}

// Migrate old entries to new schema
export function migrateHistoryEntry(entry: any): HistoryEntry | null {
  try {
    // If already valid, return as-is
    if (validateHistoryEntry(entry)) {
      return entry;
    }
    
    // Migrate from old schema
    if (entry.plan && entry.checklist && entry.questions !== undefined) {
      const migratedEntry: HistoryEntry = {
        id: entry.id || generateId(),
        createdAt: entry.createdAt || new Date().toISOString(),
        company: entry.company || "",
        role: entry.role || "",
        jdText: entry.jdText || "",
        extractedSkills: entry.extractedSkills || {
          coreCS: [],
          languages: [],
          web: [],
          data: [],
          cloud: [],
          testing: [],
          other: []
        },
        roundMapping: [],
        checklist: entry.checklist.map((item: any) => ({
          roundTitle: item.title || `Round ${item.round}`,
          items: item.items || []
        })),
        plan7Days: entry.plan.map((day: any) => ({
          day: day.day,
          focus: day.title,
          tasks: day.tasks
        })),
        questions: entry.questions || [],
        baseScore: entry.readinessScore || entry.baseScore || 0,
        skillConfidenceMap: entry.skillConfidenceMap || initializeSkillConfidenceMap(entry.extractedSkills),
        finalScore: entry.readinessScore || entry.finalScore || 0,
        updatedAt: entry.updatedAt || entry.createdAt || new Date().toISOString()
      };
      
      return validateHistoryEntry(migratedEntry) ? migratedEntry : null;
    }
    
    return null;
  } catch (error) {
    console.error("Error migrating history entry:", error);
    return null;
  }
}

// Update history entry with new skill confidence and recalculated score
export function updateHistoryEntryWithConfidence(
  entryId: string,
  skillConfidenceMap: Record<string, "know" | "practice">,
  newFinalScore: number
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const history = getHistory();
    const updatedHistory = history.map(entry => {
      if (entry.id === entryId) {
        const migratedEntry = migrateHistoryEntry(entry);
        if (!migratedEntry) return entry;
        
        return {
          ...migratedEntry,
          skillConfidenceMap,
          finalScore: newFinalScore,
          updatedAt: new Date().toISOString()
        };
      }
      return entry;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error("Error updating history entry:", error);
    return false;
  }
}

// Get all history entries with validation
export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      console.warn("Invalid history data structure");
      return [];
    }
    
    const validEntries: HistoryEntry[] = [];
    const corruptedEntries: any[] = [];
    
    for (const entry of parsed) {
      const migratedEntry = migrateHistoryEntry(entry);
      if (migratedEntry && validateHistoryEntry(migratedEntry)) {
        validEntries.push(migratedEntry);
      } else {
        corruptedEntries.push(entry);
        console.warn("Skipping corrupted history entry:", entry.id);
      }
    }
    
    // Report corrupted entries
    if (corruptedEntries.length > 0) {
      console.warn(`${corruptedEntries.length} saved entries couldn't be loaded. Create a new analysis.`);
    }
    
    return validEntries;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
}

// Save a new history entry with full schema
export function saveToHistory(
  company: string,
  role: string,
  jdText: string,
  analysisResult: AnalysisResult
): HistoryEntry {
  if (typeof window === "undefined") {
    throw new Error("Cannot save to history on server side");
  }

  const skillConfidenceMap = initializeSkillConfidenceMap(analysisResult.extractedSkills);
  const now = new Date().toISOString();
  
  const entry: HistoryEntry = {
    id: generateId(),
    createdAt: now,
    company: company || "",
    role: role || "",
    jdText,
    extractedSkills: analysisResult.extractedSkills,
    roundMapping: [], // Will be populated based on analysis
    checklist: analysisResult.checklist.map(item => ({
      roundTitle: item.title,
      items: item.items
    })),
    plan7Days: analysisResult.plan.map(day => ({
      day: day.day,
      focus: day.title,
      tasks: day.tasks
    })),
    questions: analysisResult.questions,
    baseScore: analysisResult.readinessScore,
    skillConfidenceMap,
    finalScore: analysisResult.readinessScore,
    updatedAt: now
  };

  try {
    const history = getHistory();
    // Add new entry at the beginning
    const updatedHistory = [entry, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return entry;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    throw error;
  }
}

// Get a specific history entry by ID
export function getHistoryEntry(id: string): HistoryEntry | null {
  if (typeof window === "undefined") {
    return null;
  }

  const history = getHistory();
  return history.find((entry) => entry.id === id) || null;
}

// Delete a history entry
export function deleteHistoryEntry(id: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const history = getHistory();
    const updatedHistory = history.filter((entry) => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error("Error deleting from localStorage:", error);
    return false;
  }
}

// Clear all history
export function clearHistory(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
}

// Get the most recent entry
export function getMostRecentEntry(): HistoryEntry | null {
  if (typeof window === "undefined") {
    return null;
  }

  const history = getHistory();
  return history.length > 0 ? history[0] : null;
}