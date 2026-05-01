import styles from "./Results.module.css";

type MatchResult = {
  score: "Strong" | "Moderate" | "Weak";
  reasoning: string;
  missingSkills: string[];
};

type Result = {
  summary: string;
  match: MatchResult | null;
};

const scoreConfig = {
  Strong:   { color: "#1a8a4a", label: "Strong Match",   bg: "rgba(26,138,74,0.05)"   },
  Moderate: { color: "#b45309", label: "Moderate Match", bg: "rgba(180,83,9,0.05)"    },
  Weak:     { color: "#c0392b", label: "Weak Match",     bg: "rgba(192,57,43,0.05)"   },
};

interface ResultsProps {
  result: Result;
}

export default function Results({ result }: ResultsProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.divider} />

      <div className={styles.label}>Summary</div>
      <div className={styles.summaryBox}>
        <p className={styles.summaryText}>{result.summary}</p>
      </div>

      {result.match && (() => {
        const cfg = scoreConfig[result.match.score];
        return (
          <>
            <div className={styles.label}>Fit Score</div>
            <div
              className={styles.matchBox}
              style={{
                background: cfg.bg,
                borderColor: cfg.color + "33",
              }}
            >
              <div className={styles.matchHeader}>
                <span className={styles.matchTitle}>Your resume vs this role</span>
                <span
                  className={styles.scorePill}
                  style={{ color: cfg.color, borderColor: cfg.color + "44" }}
                >
                  {cfg.label}
                </span>
              </div>

              <p className={styles.reasoning}>{result.match.reasoning}</p>

              {result.match.missingSkills.length > 0 && (
                <>
                  <div className={styles.gapsLabel}>Gaps to address</div>
                  <div className={styles.gaps}>
                    {result.match.missingSkills.map((s) => (
                      <span key={s} className={styles.gapTag}>{s}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        );
      })()}
    </div>
  );
}