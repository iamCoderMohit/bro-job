import styles from "./HowItWorks.module.css";

const steps = [
  {
    num: "01",
    icon: "📄",
    title: "Upload your resume",
    desc: "Upload your PDF resume once. We extract the text and keep it in your session — nothing is stored on our servers.",
  },
  {
    num: "02",
    icon: "📋",
    title: "Paste a job description",
    desc: "Copy any job description from LinkedIn, Greenhouse, Lever, Indeed — anywhere. Paste it in.",
  },
  {
    num: "03",
    icon: "⚡",
    title: "Get your answer instantly",
    desc: "A 2-sentence summary of the role and a fit score against your resume. Know in seconds, not minutes.",
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            <div className={styles.label}>How it works</div>
            <h2 className={styles.heading}>
              Three steps.<br />Ten seconds.
            </h2>
          </div>
          <p className={styles.sub}>
            No account needed. No complicated setup. Just paste and go.
          </p>
        </div>

        <div className={styles.steps}>
          {steps.map((s, i) => (
            <div key={s.num} className={styles.step}>
              <div className={styles.stepNum}>{s.num}</div>
              <div className={styles.stepIcon}>{s.icon}</div>
              <div className={styles.stepTitle}>{s.title}</div>
              <p className={styles.stepDesc}>{s.desc}</p>
              {i < steps.length - 1 && (
                <span className={styles.connector}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}