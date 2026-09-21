"use client";
import type { CSSProperties } from "react";
import type { Answer } from "@/data/kzi-methodology.example";
import { methodology } from "@/data/kzi-scoring.example";
import { liveScore } from "@/lib/kzi/liveScore";
import { scoreContent as copy } from "@/data/score-content";
import styles from "./ScoreOverview.module.css";
const format = (n: number) => n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
export function ScoreOverview({ answers, currentStep, onEdit, final = false }: {
  answers: Record<string, Answer>; currentStep?: number; onEdit: (step: number) => void; final?: boolean;
}) {
  const result = liveScore(methodology, answers);
  const ratio = result.maxScore ? result.totalScore / result.maxScore : 0;
  // Continuous visual scale, deliberately not a regulatory threshold.
  const color = result.completedCount ? `hsl(${Math.round(ratio * 135)} 65% 32%)` : "var(--brand-ink)";
  const stats = <>
    <div className={styles.counts}>{Object.entries(result.counts).map(([key, count]) => <div key={key}><strong>{count}</strong><span>{copy.labels[key as keyof typeof copy.labels]}</span></div>)}</div>
    <h3>{copy.groups}</h3>
    <div className={styles.groups}>{result.groupScores.map((group, index) => <div className={styles.group} key={group.id}>
      <div><span className={styles.index}>0{index + 1}</span><span>{group.title}</span><strong>{format(group.score)}{!final && <small> / {format(group.max)}</small>}</strong></div>
      <div className={styles.track} role="img" aria-label={`${group.title}: ${format(group.score)} из ${format(group.max)}`}><span style={{ width: `${group.max ? group.score / group.max * 100 : 0}%` }} /></div>
      <p>{group.completed}/{group.count} {copy.answered}<span>max {format(group.max)}</span></p>
    </div>)}</div>
    {!final && <details className={styles.mapDetails}><summary>{copy.map}</summary><p className={styles.hint}>{copy.mapHint}</p>
    <div className={styles.map}>{methodology.indicators.map((item, index) => {
      const answer = answers[item.id];
      return <button key={item.id} disabled={!answer && index !== currentStep} className={styles[answer ?? "unanswered"]} aria-current={index === currentStep ? "step" : undefined} aria-label={`${copy.question} ${index + 1}: ${item.title}. ${copy.labels[answer ?? "unanswered"]}`} onClick={() => onEdit(index)}><span>{index + 1}</span><small aria-hidden="true">{answer === "yes" ? "+" : answer === "no" ? "−" : answer === "unknown" ? "?" : "·"}</small></button>;
    })}</div></details>}
  </>;
  return <aside className={`${styles.overview} ${final ? styles.final : ""}`} style={{ "--score-color": color } as CSSProperties} aria-label={final ? copy.final : copy.live}>
    <div className={styles.top}>
      <div><p className={styles.label}>{final ? copy.final : copy.live}</p><p className={styles.number} aria-live="polite" aria-atomic="true">{result.completedCount ? format(result.totalScore) : "—"}</p><p className={styles.base}>{copy.base}</p></div>
      <svg viewBox="0 0 100 100" className={styles.ring} aria-hidden="true"><circle cx="50" cy="50" r="42" className={styles.ringTrack}/><circle cx="50" cy="50" r="42" pathLength="100" strokeDasharray={`${ratio * 100} 100`} className={styles.ringValue}/><text x="50" y="54" textAnchor="middle">{result.completedCount ? `${Math.round(ratio * 100)}%` : "—"}</text></svg>
    </div>
    <p className={styles.status}>{!result.completedCount ? copy.start : result.counts.unanswered ? copy.running : copy.done}</p>
    <p className={styles.note}>{copy.note}</p>
    {final ? <div className={styles.stats}>{stats}</div> : <><div className={styles.desktop}><div className={styles.stats}>{stats}</div></div><details className={styles.disclosure}><summary>{copy.details}</summary><div className={styles.stats}><p className={styles.mobileNote}>{copy.note}</p>{stats}</div></details></>}
  </aside>;
}
