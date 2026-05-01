"use client";

import styles from "./JobInput.module.css";

interface JobInputProps {
  jd: string;
  onChange: (value: string) => void;
}

export default function JobInput({ jd, onChange }: JobInputProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.stepNum}>2</span>
        <span className={styles.stepLabel}>Paste the job description</span>
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Paste the full job description here..."
        value={jd}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className={styles.footer}>
        <span className={styles.hint}>The more detail, the better the match</span>
        <span className={`${styles.charCount} ${jd.length > 0 ? styles.charCountActive : ""}`}>
          {jd.length} chars
        </span>
      </div>
    </div>
  );
}