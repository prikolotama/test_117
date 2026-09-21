import type { Answer, KziGroup, KziIndicator } from "../../data/kzi-methodology.example.ts";
export type ScoredIndicator = KziIndicator & { value: number };
export type ScoredGroup = KziGroup & { weight: number };
export type GroupScore = { id: string; title: string; score: number; max: number; completed: number; count: number };
export type ResultItem = ScoredIndicator & { impact: number; groupTitle: string };
export type KziResult = { totalScore: number; maxScore: number; groupScores: GroupScore[]; failedIndicators: ResultItem[]; unknownIndicators: ResultItem[]; completedCount: number };
export type CalculationRule = (result: KziResult, answers: Readonly<Record<string, Answer>>) => KziResult;
export type Methodology = { groups: ScoredGroup[]; indicators: ScoredIndicator[]; answerValues: Record<Answer, number>; rules: CalculationRule[] };
const round = (value: number) => Math.round(value * 1e8) / 1e8;
export function calculateKzi(methodology: Methodology, answers: Readonly<Record<string, Answer>>): KziResult {
  const { groups, indicators, answerValues } = methodology;
  if (!groups.length || !indicators.length || new Set(groups.map(g => g.id)).size !== groups.length || new Set(indicators.map(i => i.id)).size !== indicators.length) throw new Error("Invalid methodology identifiers");
  for (const answer of ["yes", "no", "unknown"] as const) { const factor = answerValues[answer]; if (!Number.isFinite(factor) || factor < 0 || factor > 1) throw new Error("Invalid answer factor"); }
  for (const group of groups) if (!Number.isFinite(group.weight) || group.weight < 0 || !indicators.some(i => i.groupId === group.id)) throw new Error("Invalid group weight");
  for (const indicator of indicators) {
    if (!groups.some(g => g.id === indicator.groupId) || !Number.isFinite(indicator.value) || indicator.value < 0) throw new Error("Invalid indicator configuration");
    if (!["yes", "no", "unknown"].includes(answers[indicator.id])) throw new Error("All indicators must be answered");
  }
  if (Object.keys(answers).some(id => !indicators.some(i => i.id === id))) throw new Error("Unknown indicator answer");
  const groupScores = groups.map(group => {
    const members = indicators.filter(i => i.groupId === group.id);
    return { id: group.id, title: group.title, score: round(members.reduce((n, i) => n + i.value * answerValues[answers[i.id]], 0) * group.weight), max: round(members.reduce((n,i) => n + i.value,0) * group.weight), completed: members.length, count: members.length };
  });
  const list = (answer: Answer): ResultItem[] => indicators.filter(i => answers[i.id] === answer).map(i => {
    const group = groups.find(g => g.id === i.groupId)!;
    return { ...i, impact: round(i.value * group.weight * (answerValues.yes - answerValues[answer])), groupTitle: group.title };
  }).sort((a,b) => b.impact - a.impact || a.order - b.order);
  const base: KziResult = { totalScore: round(groupScores.reduce((n,g) => n + g.score,0)), maxScore: round(groupScores.reduce((n,g) => n + g.max,0)), groupScores, failedIndicators: list("no"), unknownIndicators: list("unknown"), completedCount: indicators.length };
  return methodology.rules.reduce((result, rule) => rule(result, answers), base);
}
