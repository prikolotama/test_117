"use client";
import { useEffect, useRef, useState } from "react";
import { resultActions as copy } from "@/data/result-actions";
import styles from "./ResultActions.module.css";
import { Icon } from "@/components/Icon";

export type ActionKind = "audit" | "checku";
export function ResultActions({ onOpen }: { onOpen: (kind: ActionKind) => void }) {
  const [sent, setSent] = useState(false);
  const [fields, setFields] = useState({ email: "", company: "", name: "" });
  const emailRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const interacted = useRef(false);
  useEffect(() => {
    if (interacted.current) (sent ? successRef.current : emailRef.current)?.focus({ preventScroll: true });
  }, [sent]);
  return <>
    <section className={styles.save} aria-labelledby="save-results-title">
      <div className={styles.saveCopy}><p className={styles.kicker}><Icon name="document" /> Результаты вашей оценки</p><h2 id="save-results-title">{copy.saveTitle}</h2><p>{copy.saveText}</p><ul>{copy.materials.map(item => <li key={item}>{item}</li>)}</ul></div>
      <div className={styles.formPanel}>
        {sent ? <div className={styles.success} role="status"><h3 ref={successRef} tabIndex={-1}>{copy.sent}</h3><p>{copy.sentText}</p><strong className={styles.email}>{fields.email}</strong><button className={styles.secondary} onClick={() => { interacted.current = true; setSent(false); }}>{copy.editEmail}</button></div> :
          <form className={styles.form} onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setFields({ email: String(data.get("email") ?? ""), company: String(data.get("company") ?? ""), name: String(data.get("name") ?? "") }); interacted.current = true; setSent(true); }}>
            <label>{copy.email}<input ref={emailRef} type="email" name="email" autoComplete="email" required defaultValue={fields.email} /></label>
            <label>{copy.company}<input name="company" autoComplete="organization" required pattern=".*\S.*" defaultValue={fields.company} /></label>
            <label>{copy.optionalName}<input name="name" autoComplete="name" defaultValue={fields.name} /></label>
            <button className="button" type="submit">{copy.saveButton}<Icon name="arrow" /></button>
          </form>}
        <p className={styles.note}>{copy.disclaimer}</p><p className={styles.note}>{copy.prototype}</p>
      </div>
    </section>
    <section className={styles.next} aria-labelledby="next-actions-title"><h2 id="next-actions-title">{copy.nextTitle}</h2><p>{copy.nextText}</p>
      <div className={styles.cards}>{(["audit", "checku"] as const).map((kind, index) => <article key={kind} className={styles.card} data-kind={kind}>
        <p className={styles.eyebrow}><span aria-hidden="true">0{index + 1}</span>{copy[kind].eyebrow}</p><h3>{copy[kind].title}</h3><p>{copy[kind].text}</p><button className="button" onClick={() => onOpen(kind)}>{copy[kind].cta}<Icon name="arrow" /></button>
      </article>)}</div>
    </section>
  </>;
}

export function ActionDialog({ kind, onClose }: { kind: ActionKind; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const [phase, setPhase] = useState<"info" | "form" | "success">(kind === "checku" ? "info" : "form");
  useEffect(() => { dialog.current?.showModal(); }, []);
  useEffect(() => { title.current?.focus(); }, [phase]);
  const heading = phase === "success" ? copy.thanks : phase === "info" ? copy.checkuTitle : kind === "audit" ? copy.audit.cta : copy.demo;
  return <dialog ref={dialog} className={styles.dialog} aria-labelledby="action-dialog-title" onClose={onClose}>
    <button className={styles.close} aria-label={copy.close} onClick={() => dialog.current?.close()}>×</button>
    <h2 id="action-dialog-title" ref={title} tabIndex={-1}>{heading}</h2>
    {phase === "info" ? <><p>{copy.checkuText}</p><ul>{copy.features.map(item => <li key={item}>{item}</li>)}</ul><button className="button" onClick={() => setPhase("form")}>{copy.demo}</button></> : phase === "form" ? <>
      <p>{kind === "audit" ? copy.auditFormText : copy.demoText}</p>
      <form className={styles.form} onSubmit={event => { event.preventDefault(); setPhase("success"); }}>
        <label>{copy.name}<input name="name" autoComplete="name" required pattern=".*\S.*" /></label>
        <label>{copy.company}<input name="company" autoComplete="organization" required pattern=".*\S.*" /></label>
        <label>{copy.email}<input name="email" type="email" autoComplete="email" required /></label>
        <label>{copy.phone}<input name="phone" type="tel" autoComplete="tel" required minLength={6} /></label>
        <button className="button" type="submit">{copy.submit}</button>
      </form>
      {kind === "checku" && <button className={styles.secondary} onClick={() => setPhase("info")}>{copy.back}</button>}
    </> : <button className="button" onClick={() => dialog.current?.close()}>{copy.close}</button>}
    <p className={styles.note}>{copy.prototype}</p>
  </dialog>;
}
