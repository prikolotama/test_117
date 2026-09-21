"use client";
import { ScoreOverview } from "@/components/ScoreOverview/ScoreOverview";
import { useRef, useState, type RefObject } from "react";
import { ActionDialog, ResultActions, type ActionKind } from "./ResultActions";
import { methodology } from "@/data/kzi-scoring.example";
import { resultContent as copy } from "@/data/result-content";
import { questionnaireContent } from "@/data/questionnaire-content";
import { calculateKzi, type ResultItem } from "@/lib/kzi/calculateKzi";
import type { Answer } from "@/data/kzi-methodology.example";
import styles from "./KziResult.module.css";
const format = (value: number) => new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(value);
export function KziResult({ answers, onEdit, onRestart, titleRef }: { answers: Record<string,Answer>; onEdit: (step: number) => void; onRestart: () => void; titleRef: RefObject<HTMLHeadingElement | null> }) {
  const result = calculateKzi(methodology, answers);
  const dialog = useRef<HTMLDialogElement>(null);
  const restartButton = useRef<HTMLButtonElement>(null);
  const [action, setAction] = useState<ActionKind | null>(null);
  const actionTrigger = useRef<HTMLElement | null>(null);
  function openAction(kind: ActionKind) {
    actionTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setAction(kind);
  }
  const edit = (id: string) => onEdit(methodology.indicators.findIndex(i => i.id === id));
  function list(items: ResultItem[], empty: string) {
    return items.length ? <ul className={styles.items}>{items.map(item => <li key={item.id}>
      <p className={styles.meta}>{item.code} · {item.groupTitle}</p>
      <h3>{item.title}</h3>
      <p>{copy.impact}: {format(item.impact)}</p>
      <details><summary>{copy.evidence}</summary><ul>{item.evidence.map(text => <li key={text}>{text}</li>)}</ul></details>
      <button onClick={() => edit(item.id)}>{copy.editItem}</button>
    </li>)}</ul> : <p>{empty}</p>;
  }
  return <div className={styles.result}>
    <section className={styles.summary}>
      <h1 ref={titleRef} tabIndex={-1}>{copy.title}</h1>
      <p>{copy.subtitle}</p>
      <nav className={styles.breakdownNav} aria-label={copy.breakdown}>
        <p>{copy.breakdown}</p>
        <a href="#failed"><strong>{result.failedIndicators.length}</strong><span>{copy.failed}</span><span aria-hidden="true">↓</span></a>
        <a href="#unknown"><strong>{result.unknownIndicators.length}</strong><span>{copy.unknownTitle}</span><span aria-hidden="true">↓</span></a>
        <small>{copy.breakdownHint}</small>
      </nav>
      <p className={styles.notice}>{copy.draft}</p>
      <div className={styles.actions}><button className="button" onClick={() => onEdit(0)}>{copy.edit}</button><button ref={restartButton} className={styles.secondary} onClick={() => dialog.current?.showModal()}>{copy.restart}</button></div>
    </section>
    <ScoreOverview answers={answers} onEdit={onEdit} final />
    <ResultActions onOpen={openAction} />
    <section id="failed"><h2>{copy.failed} <span>({result.failedIndicators.length})</span></h2><p className={styles.description}>{copy.failedNote}</p>{list(result.failedIndicators, copy.emptyFailed)}</section>
    <section id="unknown"><h2>{copy.unknownTitle} <span>({result.unknownIndicators.length})</span></h2><p className={styles.description}>{copy.unknownDescription}</p>{list(result.unknownIndicators, copy.emptyUnknown)}</section>
    <details id="all-answers" className={styles.all}><summary>{copy.all}</summary><ol>{methodology.indicators.map(item => <li key={item.id}><span>{item.title}</span><strong>{questionnaireContent.answers.find(option => option.value === answers[item.id])?.label}</strong><button onClick={() => edit(item.id)}>{copy.editItem}</button></li>)}</ol></details>
    {action && <ActionDialog kind={action} onClose={() => { setAction(null); actionTrigger.current?.focus({ preventScroll: true }); }} />}
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="restart-title" onClose={() => restartButton.current?.focus()}>
      <h2 id="restart-title">{copy.confirmTitle}</h2><p>{copy.confirmDescription}</p>
      <div className={styles.actions}><button className={styles.secondary} autoFocus onClick={() => dialog.current?.close()}>{copy.cancel}</button><button className="button" onClick={() => { dialog.current?.close(); onRestart(); }}>{copy.confirm}</button></div>
    </dialog>
  </div>;
}
