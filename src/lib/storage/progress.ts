import { indicators, methodologyVersion, type Answer } from "../../data/kzi-methodology.example.ts";
export const STORAGE_KEY = "checku:kzi:progress";
export type Progress = {
  methodologyVersion: string;
  answers: Record<string, Answer>;
  currentStep: number;
  updatedAt: string;
  completed: boolean;
};
export type Notice = "resetVersion" | "invalidStorage" | "saveError" | null;
export function freshProgress(): Progress {
  return { methodologyVersion, answers: {}, currentStep: 0, updatedAt: new Date().toISOString(), completed: false };
}
export function parseProgress(raw: string | null): { progress: Progress; notice: Notice } {
  const empty = freshProgress();
  if (raw === null) return { progress: empty, notice: null };
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") throw new Error("Invalid progress");
    if (typeof data.methodologyVersion !== "string") throw new Error("Invalid version");
    if (data.methodologyVersion !== methodologyVersion) return { progress: empty, notice: "resetVersion" };
    if (!data.answers || typeof data.answers !== "object" || Array.isArray(data.answers) || !Number.isInteger(data.currentStep) || data.currentStep < 0 || data.currentStep >= indicators.length || typeof data.completed !== "boolean" || typeof data.updatedAt !== "string" || !Number.isFinite(Date.parse(data.updatedAt))) throw new Error("Invalid progress");
    const ids = new Set(indicators.map((item) => item.id));
    for (const [id, answer] of Object.entries(data.answers)) {
      if (!ids.has(id) || !["yes", "no", "unknown"].includes(answer as string)) throw new Error("Invalid answer");
    }
    const firstMissing = indicators.findIndex((item) => !data.answers[item.id]);
    // Never restore a completed screen or jump past unanswered questions from malformed storage.
    if ((data.completed && firstMissing !== -1) || (firstMissing !== -1 && data.currentStep > firstMissing)) throw new Error("Incomplete progress");
    return { progress: data as Progress, notice: null };
  } catch {
    return { progress: empty, notice: "invalidStorage" };
  }
}
export function readProgress(): { progress: Progress; notice: Notice } {
  try { return parseProgress(window.localStorage.getItem(STORAGE_KEY)); }
  catch { return { progress: freshProgress(), notice: "saveError" }; }
}
export function saveProgress(progress: Progress): boolean {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); return true; }
  catch { return false; }
}
