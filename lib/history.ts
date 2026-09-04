/**
 * Local storage abstraction layer.
 * Manages persisting Codeforces histories and locally skipped/solved problems
 * in the browser to keep the app blazing fast without a database.
 */

const STORAGE_KEY = "blindfold_seen_problems";
const CF_HISTORY_KEY = "blindfold_cf_history";

/**
 * Check localStorage availability to prevent SSR crashes.
 */
function isStorageAvailable(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

export function getSeenProblems(): string[] {
  if (!isStorageAvailable()) return [];
  try {
    const data = window.localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed.filter(item => typeof item === "string");
    }
    return [];
  } catch (error) {
    return [];
  }
}

export function markProblemSeen(problemId: string): void {
  if (!isStorageAvailable() || !problemId) return;
  try {
    const seen = new Set(getSeenProblems());
    seen.add(problemId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(seen)));
  } catch (error) {}
}

export function hasSeenProblem(problemId: string): boolean {
  if (!isStorageAvailable() || !problemId) return false;
  return getSeenProblems().includes(problemId);
}

export function clearHistory(): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {}
}

export function getCfHistory(): { handle: string; solvedProblemIds: string[]; attemptedProblemIds: string[] } | null {
  if (!isStorageAvailable()) return null;
  try {
    const data = window.localStorage.getItem(CF_HISTORY_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveCfHistory(history: { handle: string; solvedProblemIds: string[]; attemptedProblemIds: string[] }): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(CF_HISTORY_KEY, JSON.stringify(history));
  } catch (err) {}
}

export function clearCfHistory(): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(CF_HISTORY_KEY);
  } catch (err) {}
}

/**
 * Manually marks a problem as solved locally to prevent future recommendations.
 */
export function markProblemSolvedLocally(problemId: string): void {
  if (!isStorageAvailable() || !problemId) return;
  const history = getCfHistory();
  if (history) {
    const solved = new Set(history.solvedProblemIds);
    solved.add(problemId);
    history.solvedProblemIds = Array.from(solved);
    saveCfHistory(history);
  }
}
