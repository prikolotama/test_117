"use client";

import { useEffect, useState } from "react";
import { questionnaireContent as copy } from "@/data/questionnaire-content";
import styles from "./AnswerFeedback.module.css";

export function AnswerFeedback({ answer }: { answer: "no" | "unknown" | null }) {
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!answer || !visible || hovered || focused) return;
    const timer = window.setTimeout(() => setVisible(false), 8000);
    return () => window.clearTimeout(timer);
  }, [answer, visible, hovered, focused]);

  const message = answer && visible ? copy.feedback[answer] : null;
  return <div className={styles.slot}>
    <div role="status" aria-live="polite" aria-atomic="true">
      {message && <div className={styles.message}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
        <div><p className={styles.title}>{message.title}</p><p>{message.text}</p></div>
        <button type="button" aria-label={copy.feedback.close} onClick={() => setVisible(false)}>×</button>
      </div>}
    </div>
    {!message && <p className={styles.hint}>{copy.hint}</p>}
  </div>;
}
