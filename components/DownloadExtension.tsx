import styles from "./DownloadExtension.module.css";

export default function DownloadExtension() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* Left — text */}
        <div className={styles.left}>
          <div className={styles.eyebrow}>
            <span className={styles.dot} />
            Chrome Extension
          </div>

          <h2 className={styles.heading}>
            One click.<br />
            Any job site.
          </h2>

          <p className={styles.sub}>
            Install the extension and bro.job works wherever you browse —
            LinkedIn, Indeed, Greenhouse, Naukri. No copy-pasting, no tab switching.
            Just open it and get your answer.
          </p>

          <ul className={styles.perks}>
            <li><span className={styles.check}>✓</span> Works on every job board</li>
            <li><span className={styles.check}>✓</span> Resume saved locally, never uploaded to servers</li>
            <li><span className={styles.check}>✓</span> Instant — no page reload needed</li>
          </ul>

          <a
            href="#"
            className={styles.cta}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="4" fill="currentColor"/>
              <path d="M10 1v3M10 16v3M1 10h3M16 10h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Add to Chrome — it's free
          </a>

          <p className={styles.hint}>No account required · 2 MB</p>
        </div>

        {/* Right — extension mockup */}
        <div className={styles.right}>
          <div className={styles.mockupWrap}>

            {/* Glow blob */}
            <div className={styles.blob} />

            {/* Browser chrome bar */}
            <div className={styles.browserBar}>
              <div className={styles.browserDots}>
                <span /><span /><span />
              </div>
              <div className={styles.browserUrl}>linkedin.com/jobs/view/…</div>
              <div className={styles.extIcon}>
                <span>B</span>
              </div>
            </div>

            {/* Popup card */}
            <div className={styles.popup}>
              <div className={styles.popupHeader}>
                <span className={styles.popupLogo}>bro<span>.job</span></span>
                <span className={styles.popupVersion}>v1.0</span>
              </div>

              <div className={styles.popupSection}>
                <div className={styles.popupLabel}>
                  <span className={styles.stepBadge}>1</span> Your resume
                  <span className={styles.readyBadge}>✓ Ready</span>
                </div>
              </div>

              <div className={styles.popupDivider} />

              <div className={styles.popupSection}>
                <div className={styles.popupLabel}>
                  <span className={styles.stepBadge}>2</span> Job on this page
                </div>
                <div className={styles.pageDetected}>Job description detected ✓</div>
              </div>

              <button className={styles.popupBtn}>Analyse Job →</button>

              <div className={styles.popupResult}>
                <div className={styles.resultRow}>
                  <span className={styles.resultLabel}>Summary</span>
                </div>
                <p className={styles.resultText}>
                  Senior React role at a fintech startup. Needs 5+ years and strong design sensibility.
                </p>
                <div className={styles.resultRow} style={{ marginTop: 10 }}>
                  <span className={styles.resultLabel}>Fit Score</span>
                  <span className={styles.scoreStrong}>Strong Match</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}