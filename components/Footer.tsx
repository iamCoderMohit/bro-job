import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link href="/" className={styles.logo}>
        bro<span>.</span>job
      </Link>

      <p className={styles.copy}>© {new Date().getFullYear()} bro.job · Free forever</p>

      <ul className={styles.links}>
        <li><Link href="/dashboard" className={styles.link}>Try it free</Link></li>
        <li><Link href="#how-it-works" className={styles.link}>How it works</Link></li>
        <li><Link href="#features" className={styles.link}>Features</Link></li>
      </ul>
    </footer>
  );
}