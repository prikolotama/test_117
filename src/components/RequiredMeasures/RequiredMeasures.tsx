import { requiredMeasures as copy } from "@/data/required-measures";
import { Icon } from "@/components/Icon";
import styles from "./RequiredMeasures.module.css";
export function RequiredMeasures() {
  return (
    <section className={styles.block} aria-labelledby="required-measures-title">
      <h3 id="required-measures-title">{copy.title}</h3>
      <p className={styles.description}>{copy.description}</p>
      <details className={styles.details}>
      <summary>Все 21 мероприятие<Icon name="chevron" /></summary>
      <div className={styles.panel}>
        <ol>{copy.items.map(([, text], index) => <li key={text}><span>{String(index + 1).padStart(2, "0")}</span>{text}</li>)}</ol>
        <a href={copy.url} target="_blank" rel="noopener noreferrer">{copy.source}</a>
      </div>
    </details>
    </section>
  );
}
