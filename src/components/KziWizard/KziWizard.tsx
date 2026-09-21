"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { groups, indicators, methodologySource, type Answer } from "@/data/kzi-methodology.example";
import { questionnaireContent as copy } from "@/data/questionnaire-content";
import { freshProgress, readProgress, saveProgress, type Notice, type Progress } from "@/lib/storage/progress";
import { Icon } from "@/components/Icon";
import { ScoreOverview } from "@/components/ScoreOverview/ScoreOverview";
import { KziResult } from "@/components/KziResult/KziResult";
import { resultContent } from "@/data/result-content";
import styles from "./KziWizard.module.css";
import { AnswerFeedback } from "./AnswerFeedback";
import { EnterpriseMoment } from "./EnterpriseMoment";

export function KziWizard() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [feedback, setFeedback] = useState<"no" | "unknown" | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const focusNext = useRef(false);
  useEffect(() => {
    const stored = readProgress();
    // Browser storage must be restored after hydration, never read during server rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(stored.progress);
    setNotice(stored.notice);
  }, []);
  useEffect(() => {
    if (focusNext.current) {
      titleRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
      window.dispatchEvent(new Event("checku:step"));
      focusNext.current = false;
    }
  }, [progress?.currentStep, progress?.completed]);

  function update(next: Progress) {
    const stamped = { ...next, updatedAt: new Date().toISOString() };
    setProgress(stamped);
    const saved = saveProgress(stamped);
    if (!saved) setNotice("saveError");
    else setNotice(null);
  }
  function answer(value: Answer) {
    if (!progress) return;
    setFeedback(value === "yes" ? null : value);
    update({ ...progress, answers: { ...progress.answers, [indicators[progress.currentStep].id]: value }, completed: false });
  }
  function go(step: number) {
    if (!progress) return;
    focusNext.current = true;
    setEvidenceOpen(false);
    setFeedback(null);
    update({ ...progress, currentStep: step, completed: false });
  }
  const current = progress ?? freshProgress();
  const question = indicators[current.currentStep];
  const group = groups.find((item) => item.id === question.groupId)!;
  const completedCount = indicators.filter((item) => current.answers[item.id]).length;
  const percent = Math.round(completedCount / indicators.length * 100);
  const chosen = current.answers[question.id];

  return (
    <div className={styles.page}>
      <div className={styles.top}><Link className={styles.homeLink} href="/">← Вернуться на главную</Link><span>{copy.title}</span>{progress && !progress.completed && completedCount === indicators.length && <button className={styles.back} onClick={() => { focusNext.current = true; update({ ...progress, completed: true }); }}>{resultContent.result}</button>}</div>
      <aside className={styles.draft}>{copy.draft} <a href={methodologySource} target="_blank" rel="noopener noreferrer">{copy.source}</a></aside>
      {notice && <p className={styles.notice} role="status">{copy[notice]}</p>}
      {!progress ? <p role="status">{copy.loading}</p> : progress.completed ? (
        <KziResult answers={progress.answers} titleRef={titleRef} onEdit={go} onRestart={() => { focusNext.current = true; setEvidenceOpen(false); setFeedback(null); update(freshProgress()); }} />
      ) : (
        <>
          <div className={styles.progress}>
            <div className={styles.progressText}><span>{copy.step} {current.currentStep + 1} {copy.of} {indicators.length}</span><span>{copy.answered}: {completedCount} / {indicators.length} · {percent}%</span></div>
            <progress aria-label={copy.progressLabel} max={indicators.length} value={completedCount} />
            <p>{group.title}</p>
          </div>
          <div className={styles.workspace}>
          <div className={styles.live}><ScoreOverview answers={progress.answers} currentStep={current.currentStep} onEdit={go} /></div>
          <section className={styles.card} aria-labelledby="question-title">
            <p className={styles.group}>{group.order} / {groups.length} · {group.title}</p>
            <h1 id="question-title" ref={titleRef} tabIndex={-1}>{question.title}</h1>
            <p className={styles.description}>{question.description}</p>
            <fieldset className={styles.answers} aria-labelledby="question-title" aria-describedby="answer-hint">
              <legend className={styles.legend}>{copy.answerLabel}</legend>
              {copy.answers.map((option) => (
                <label key={option.value} className={styles.option}>
                  <input type="radio" name={question.id} value={option.value} checked={chosen === option.value} onChange={() => answer(option.value)} />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
            <div id="answer-hint"><AnswerFeedback key={`${current.currentStep}:${feedback}`} answer={feedback} /></div>
            <button type="button" className={styles.evidenceButton} aria-expanded={evidenceOpen} aria-controls="question-evidence" onClick={() => setEvidenceOpen(!evidenceOpen)}>{copy.evidence}<Icon name="chevron" /></button>
            <div id="question-evidence" className={styles.evidence} hidden={!evidenceOpen}>
              <ul>{question.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
              <p>{copy.evidenceNote}</p>
            </div>
            <div className={styles.navigation}>
              <button type="button" className={styles.back} disabled={current.currentStep === 0} onClick={() => go(current.currentStep - 1)}>{copy.back}</button>
              <button type="button" className="button" disabled={!chosen} onClick={() => {
                if (!chosen) return;
                if (current.currentStep < indicators.length - 1) go(current.currentStep + 1);
                else if (completedCount === indicators.length) { focusNext.current = true; update({ ...progress, completed: true }); }
              }}>{current.currentStep === indicators.length - 1 ? copy.finish : copy.next}<Icon name="arrow" /></button>
            </div>
            <p className={styles.save}>{notice === "saveError" ? copy.saveError : copy.saved}</p>
          </section>
          </div>
          {current.currentStep + 1 === copy.enterprise.bannerStep && <EnterpriseMoment variant="banner" />}
          {current.currentStep + 1 === copy.enterprise.textStep && <EnterpriseMoment variant="text" />}
        </>
      )}
    </div>
  );
}
