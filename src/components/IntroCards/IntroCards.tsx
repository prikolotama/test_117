"use client";

import Link from "next/link";
import { RequiredMeasures } from "@/components/RequiredMeasures/RequiredMeasures";
import { content } from "@/data/content";
import { Icon } from "@/components/Icon";
import styles from "./IntroCards.module.css";

export function IntroCards() {
  const { intro } = content;
  return (
    <section id="before-assessment" className={`container ${styles.intro}`} aria-labelledby="intro-title">
      <h2 id="intro-title">{intro.title}</h2>
      <div className={styles.cards}>
        {intro.cards.filter(card => card.icon !== "chart").map((card, index) => (
            <article key={card.icon} className={styles.card} style={{ "--card-column": index + 1 } as React.CSSProperties}>
              <div className={styles.cardHeading}>
                <div className={styles.cardIndex} aria-hidden="true"><span>0{index + 1}</span><Icon name={card.icon} /></div>
                <h3>{card.title}</h3>
              </div>
              <p className={styles.cardBody}>{card.text}</p>
              <div className={styles.cardFooter}>
                <details className={styles.details}>
                  <summary>{card.icon === "grid" ? intro.groupDetails.label : intro.evidenceDetails.label}</summary>
                  {card.icon === "grid" ? <section className={styles.panel} aria-labelledby="groups-title"><h3 id="groups-title">{intro.groupDetails.label}</h3><ol className={styles.groupList}>{intro.groupDetails.items.map(group => <li key={group.title}><h4>{group.title}</h4><p>{group.text}</p></li>)}</ol><a className={styles.source} href={intro.groupDetails.sourceUrl} target="_blank" rel="noopener noreferrer">{intro.groupDetails.sourceLabel}</a></section> : <section className={styles.panel} aria-labelledby="evidence-title"><h3 id="evidence-title">{intro.evidenceDetails.title}</h3><p className={styles.evidenceIntro}>{intro.evidenceDetails.description}</p><div className={styles.evidenceColumns}>{intro.evidenceDetails.columns.map(column => <div key={column.title}><h4>{column.title}</h4><ul>{column.items.map(item => <li key={item}>{item}</li>)}</ul></div>)}</div><p className={styles.evidenceNote}>{intro.evidenceDetails.note}</p><a className={styles.source} href={intro.evidenceDetails.sourceUrl} target="_blank" rel="noopener noreferrer">{intro.evidenceDetails.sourceLabel}</a></section>}
                </details>
              </div>
            </article>
        ))}
      </div>
      <div className={styles.measures}><RequiredMeasures /></div>
      <article className={styles.finalCard}>
        <div><h3>{intro.cards[2].title}</h3><p>{intro.cards[2].text}</p><p className={styles.assessmentNote}>{content.hero.microcopy}</p></div>
        <div className={styles.start}><Link href="/assessment">{intro.start}<Icon name="arrow" /></Link><p>{intro.ready}</p></div>
      </article>
    </section>
  );
}
