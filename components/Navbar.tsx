import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        bro<span>.</span>job
      </Link>

      <ul className={styles.links}>
        <li><Link href="/" className={`${styles.link} ${styles.linkActive}`}>Home</Link></li>
        <li><Link href="#how-it-works" className={styles.link}>How it works</Link></li>
        <li><Link href="#features" className={styles.link}>Features</Link></li>
      </ul>

      <Link href="/dashboard" className={styles.cta}>
        Try it free →
      </Link>
    </nav>
  );
}