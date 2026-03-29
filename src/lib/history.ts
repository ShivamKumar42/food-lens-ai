import type { HistoryEntry } from "./foodClasses";

const KEY = "food-classifier-history";
const MAX = 20;

export function getHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addHistory(entry: HistoryEntry) {
  const h = [entry, ...getHistory()].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(h));
}

export function updateFeedback(id: string, feedback: "correct" | "incorrect") {
  const h = getHistory().map((e) => (e.id === id ? { ...e, feedback } : e));
  localStorage.setItem(KEY, JSON.stringify(h));
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}
