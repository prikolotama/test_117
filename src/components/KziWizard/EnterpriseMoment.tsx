import Image from "next/image";
import banner from "@/assets/checku-pilot.png";
import { questionnaireContent } from "@/data/questionnaire-content";
import styles from "./EnterpriseMoment.module.css";

export function EnterpriseMoment({ variant }: { variant: "banner" | "text" }) {
  const copy = questionnaireContent.enterprise;
  return <aside className={variant === "banner" ? styles.inlineBanner : styles.moment} aria-label={variant === "banner" ? "CheckU" : undefined} aria-labelledby={variant === "text" ? "enterprise-title" : undefined}>
    {variant === "text" && <div className={styles.copy}>
      <h2 id="enterprise-title">{copy.title}</h2>
      <div><p>{copy.question}</p><p className={styles.answer}>{copy.text}</p></div>
    </div>}
    {variant === "banner" && <a className={styles.banner} href={copy.url} target="_blank" rel="noopener noreferrer" aria-label={copy.linkLabel}>
      <Image src={banner} alt={copy.bannerAlt} sizes="(max-width: 1240px) calc(100vw - 40px), 1200px" unoptimized />
    </a>}
  </aside>;
}
