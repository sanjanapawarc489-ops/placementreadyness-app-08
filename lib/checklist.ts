
export interface ChecklistItem {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
}

const STORAGE_KEY = "prp_test_checklist";

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "jd-validation", label: "JD required validation works", hint: "Try submitting an empty Job Description in the Analyze page.", checked: false },
  { id: "short-jd-warning", label: "Short JD warning shows for <200 chars", hint: "Enter a very short text (e.g., 50 chars) and check if a warning appears.", checked: false },
  { id: "skills-extraction", label: "Skills extraction groups correctly", hint: "Verify if skills are categorized into Languages, Frameworks, etc.", checked: false },
  { id: "round-mapping", label: "Round mapping changes based on company + skills", hint: "Try different companies (Google vs Startup) and see if interview rounds vary.", checked: false },
  { id: "score-calculation", label: "Score calculation is deterministic", hint: "The same JD should always produce the same readiness score.", checked: false },
  { id: "skill-toggles", label: "Skill toggles update score live", hint: "In Results page, clicking 'I know this' should immediately change the circular score.", checked: false },
  { id: "persistence", label: "Changes persist after refresh", hint: "Refresh the results page after toggling skills; state should be saved.", checked: false },
  { id: "history-persistence", label: "History saves and loads correctly", hint: "Check the History page to see if previous analyses are listed.", checked: false },
  { id: "export-buttons", label: "Export buttons copy the correct content", hint: "Click 'Copy 7-day Plan' and paste it to verify the text content.", checked: false },
  { id: "no-console-errors", label: "No console errors on core pages", hint: "Open DevTools (F12) and ensure no red errors appear while navigating.", checked: false },
];

export function getChecklist(): ChecklistItem[] {
  if (typeof window === "undefined") return DEFAULT_CHECKLIST;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_CHECKLIST;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_CHECKLIST;
  }
}

export function saveChecklist(checklist: ChecklistItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checklist));
}

export function resetChecklist() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function allTestsPassed(): boolean {
  const checklist = getChecklist();
  return checklist.every(item => item.checked);
}

export function getPassCount(): number {
  const checklist = getChecklist();
  return checklist.filter(item => item.checked).length;
}
