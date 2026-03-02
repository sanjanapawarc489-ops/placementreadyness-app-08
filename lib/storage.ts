import { ExtractedSkills } from "./skills";
import { AnalysisResult } from "./analysis";

const STORAGE_KEY = "placement_readiness_history";

export interface HistoryEntry {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: ExtractedSkills;
  plan: AnalysisResult["plan"];
  checklist: AnalysisResult["checklist"];
  questions: string[];
  readinessScore: number;
  generalFresherStack: boolean;
  skillConfidenceMap?: Record<string, "know" | "practice">;
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

// Migrate old entries to include skillConfidenceMap
export function migrateHistoryEntry(entry: HistoryEntry): HistoryEntry {
  if (!entry.skillConfidenceMap) {
    return {
      ...entry,
      skillConfidenceMap: initializeSkillConfidenceMap(entry.extractedSkills)
    };
  }
  return entry;
}

// Update history entry with new skill confidence and recalculated score
export function updateHistoryEntryWithConfidence(
  entryId: string,
  skillConfidenceMap: Record<string, "know" | "practice">,
  newReadinessScore: number
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const history = getHistory();
    const updatedHistory = history.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          skillConfidenceMap,
          readinessScore: newReadinessScore
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

// Get all history entries
export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
}

// Save a new history entry
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
  
  const entry: HistoryEntry = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    company: company || "Unknown Company",
    role: role || "Unknown Role",
    jdText,
    extractedSkills: analysisResult.extractedSkills,
    plan: analysisResult.plan,
    checklist: analysisResult.checklist,
    questions: analysisResult.questions,
    readinessScore: analysisResult.readinessScore,
    generalFresherStack: analysisResult.generalFresherStack,
    skillConfidenceMap,
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
  const entry = history.find((entry) => entry.id === id) || null;
  return entry ? migrateHistoryEntry(entry) : null;
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
  const entry = history.length > 0 ? history[0] : null;
  return entry ? migrateHistoryEntry(entry) : null;
}
