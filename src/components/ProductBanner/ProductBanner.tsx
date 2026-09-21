import Image from "next/image";
import banner from "@/assets/checku-stats.png";
import styles from "./ProductBanner.module.css";

export function ProductBanner() {
  return <aside className={`container ${styles.banner}`} aria-label="CheckU в цифрах">
    <a href="https://sec.ussc.ru/products/checku" target="_blank" rel="noopener noreferrer" aria-label="CheckU: сокращение времени аудита до 70% и ускорение подготовки отчётности в 3 раза по данным пилотных проектов. Консультация — в новой вкладке">
      <Image className={styles.image} src={banner} alt="CheckU сокращает время аудита до 70% и ускоряет подготовку отчётности в 3 раза. На основе данных и результатов пилотных проектов CheckU. Консультация." sizes="(max-width: 600px) 100vw, 1200px" />
      <div className={styles.mobile} aria-hidden="true"><p>CheckU в цифрах</p><h2>Меньше времени на аудит и отчётность</h2><dl><div><dt>Время аудита</dt><dd>до −70%</dd></div><div><dt>Подготовка отчётности</dt><dd>в 3 раза быстрее</dd></div></dl><p className={styles.note}>На основе данных и результатов пилотных проектов CheckU.</p><span className="button">Консультация ↗</span></div>
    </a>
  </aside>;
}
