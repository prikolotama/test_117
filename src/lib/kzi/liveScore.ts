import { calculateKzi, type Methodology } from "./calculateKzi.ts";
import type { Answer } from "../../data/kzi-methodology.example.ts";

// Unanswered items contribute zero to the running base sum, but remain
// distinct from both explicit No and Unknown in all displayed statistics.
export function liveScore(methodology: Methodology, answers: Readonly<Record<string, Answer>>) {
  const filled = Object.fromEntries(methodology.indicators.map(i => [i.id, answers[i.id] ?? "no"]));
  const result = calculateKzi({ ...methodology, rules: [] }, { ...filled, ...answers });
  const counts = { yes: 0, no: 0, unknown: 0, unanswered: 0 };
  for (const item of methodology.indicators) {
    const answer = answers[item.id];
    if (answer) counts[answer]++;
    else counts.unanswered++;
  }
  return { ...result, counts, completedCount: methodology.indicators.length - counts.unanswered,
    groupScores: result.groupScores.map(group => ({ ...group,
      completed: methodology.indicators.filter(i => i.groupId === group.id && answers[i.id]).length,
    })),
  };
}
