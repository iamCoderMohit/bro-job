import Link from "next/link";
import styles from "./Features.module.css";

const features = [
  {
    icon: "⚡",
    title: "Instant summary",
    desc: "Any job description distilled into 2 sharp sentences. Decide in 10 seconds if it's worth reading further.",
  },
  {
    icon: "🎯",
    title: "Fit score",
    desc: "Upload your resume once and get a Strong / Moderate / Weak match against any role — with clear reasoning.",
  },
  {
    icon: "🔍",
    title: "Skill gap analysis",
    desc: "Know exactly what's missing before you apply. No more guessing why you didn't hear back.",
  },
  {
    icon: "🔒",
    title: "Privacy first",
    desc: "Your resume stays in your session. Nothing is stored on our servers. No account required.",
  },
  {
    icon: "🌐",
    title: "Works everywhere",
    desc: "LinkedIn, Greenhouse, Lever, Indeed, Workday — paste from anywhere. No browser extension needed.",
  },
  {
    icon: "💸",
    title: "Free forever",
    desc: "No paywalls, no credit card, no trial. Just paste and go.",
  },
];

export default function Features() {
  return (
    <section className={styles.section} id="features">
      <div className={styles.inner}>
        <div className={styles.label}>Features</div>
        <h2 className={styles.heading}>
          Everything you need.<br />Nothing you don't.
        </h2>

        <div className={styles.grid}>
          {features.map((f) => (
            <div key={f.title} className={styles.card}>
              <div className={styles.cardIcon}>{f.icon}</div>
              <div className={styles.cardTitle}>{f.title}</div>
              <p className={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}

          <div className={`${styles.card} ${styles.ctaCard}`}>
            <div className={styles.ctaTitle}>
              Ready to stop wasting time<br />on jobs that don't fit?
            </div>
            <Link href="/dashboard" className={styles.ctaBtn}>
              Analyse your first job →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}