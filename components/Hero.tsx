import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.section}>
      {/* Left */}
      <div className={styles.left}>
        <div className={styles.badge}>AI-powered · Free to use</div>

        <h1 className={styles.heading}>
          Stop reading<br />
          <span>wall-of-text</span><br />
          job posts.
        </h1>

        <p className={styles.sub}>
          Paste any job description and get a 2-sentence summary instantly.
          Upload your resume once and know if you're a strong fit — before you spend an hour applying.
        </p>

        <div className={styles.actions}>
          <Link href="/dashboard" className={styles.btnPrimary}>
            Analyse a job free →
          </Link>
          <Link href="#how-it-works" className={styles.btnSecondary}>
            See how it works ↓
          </Link>
        </div>

        <div className={styles.tags}>
          {["No sign up", "Works on any job site", "Free forever"].map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
      </div>

      {/* Right — UI Mockup */}
      <div className={styles.right}>
        <div className={styles.blob} />
        <div className={styles.mockup}>
          <div className={styles.mockupBar}>
            <div className={styles.dot} />
            <div className={styles.dot} />
            <div className={styles.dot} />
          </div>

          <div className={styles.mockupLabel}>Job Description</div>
          <div className={styles.mockupText}>
            We're looking for a Senior Frontend Engineer to join our growing team.
            You'll work closely with design and backend to ship fast, accessible, and
            delightful experiences. 5+ years React required...
          </div>

          <div className={styles.mockupResult}>
            <div className={styles.mockupResultHeader}>
              <span className={styles.mockupResultLabel}>Summary</span>
              <span className={styles.mockupScore}>Strong Match</span>
            </div>
            <p className={styles.mockupSummary}>
              Senior React role at a growth-stage startup. Needs 5+ years and strong
              design sensibility. Fast-paced, collaborative environment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}