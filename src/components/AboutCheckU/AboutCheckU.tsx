import { content } from "@/data/content";
import { Icon } from "@/components/Icon";
import styles from "./AboutCheckU.module.css";

export function AboutCheckU() {
  const { about } = content;
  return (
    <section id="about-checku" className={`container ${styles.about}`} aria-labelledby="about-title">
      <div className={styles.copy}>
        <p className={styles.label}>{about.label}</p>
        <h2 id="about-title">{about.title}</h2>
        <p className={styles.description}>{about.description}</p>
        <a className="button" href={about.url} target="_blank" rel="noopener noreferrer">{about.cta}<Icon name="arrow" /></a>
      </div>
      <dl className={styles.features}>
        {about.features.map((feature, index) => (
          <div key={feature.title}>
            <span aria-hidden="true">0{index + 1}</span>
            <dt>{feature.title}</dt>
            <dd>{feature.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
