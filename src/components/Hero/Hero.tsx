import { content } from "@/data/content";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import styles from "./Hero.module.css";

export function Hero() {
  const { hero, navigation } = content;
  return (
    <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <div className={styles.methodologyBrand}>
          <Image src="/brand/fstec.svg" alt="" width={56} height={64} />
          <span>ФСТЭК</span>
        </div>
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 id="hero-title">{hero.title}</h1>
        <p className={styles.description}>{hero.description}</p>
        <Link className={`button ${styles.cta}`} href="/assessment">{navigation.calculate}<Icon name="arrow" /></Link>
      </div>
      <figure className={styles.preview} aria-label={hero.preview.badge}>
        <div className={styles.folder}>
          <div className={styles.folderTab} aria-hidden="true" />
          <div className={styles.folderBody}>
            <p className={styles.previewLabel}>{hero.preview.label}</p>
            <span className={styles.badge}>{hero.preview.badge}</span>
            <p className={styles.score}>{hero.preview.value}</p>
            <div className={styles.warning}>
              <Icon name="warning" />
              <div>
                <p className={styles.warningTitle}>{hero.preview.status}</p>
                <p className={styles.warningDescription}>{hero.preview.statusDescription}</p>
              </div>
            </div>
            <dl className={styles.metrics}>
              <div><dt>{hero.preview.indicators.label}</dt><dd>{hero.preview.indicators.value}</dd></div>
              <div><dt>{hero.preview.groups.label}</dt><dd>{hero.preview.groups.value}</dd></div>
            </dl>
          </div>
        </div>
      </figure>
    </section>
  );
}
