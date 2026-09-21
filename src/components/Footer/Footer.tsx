import { content } from "@/data/content";
import styles from "./Footer.module.css";

export function Footer() {
  const { footer } = content;
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div><p className={styles.brand}>{footer.brand}</p><p>{footer.description}</p></div>
        <nav aria-label={footer.navigationLabel}>
          {footer.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}
        </nav>
        <div className={styles.bottom}><p>{footer.note}</p><a href="#top">{footer.top} ↑</a></div>
      </div>
    </footer>
  );
}
