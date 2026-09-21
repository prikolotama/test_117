import Image from "next/image";
import Link from "next/link";
import { content } from "@/data/content";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header} id="top">
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.logo} aria-label={content.navigation.homeLabel}>
          <Image className={styles.defaultLogo} src="/brand/checku.svg" alt={content.navigation.brand} width={327} height={49} priority />
          <Image className={styles.inverseLogo} src="/brand/checku-inverse.svg" alt="" aria-hidden="true" width={327} height={49} />
        </a>
        <nav className={styles.nav} aria-label={content.navigation.label}>
          {content.navigation.links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <Link href="/assessment" className={`button ${styles.cta}`}>{content.navigation.calculate}</Link>
      </div>
    </header>
  );
}
