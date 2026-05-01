    "use client";

import { useRef } from "react";
import styles from "./ResumeUpload.module.css";

interface ResumeUploadProps {
  resumeText: string;
  resumeName: string;
  uploadLoading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ResumeUpload({
  resumeText,
  resumeName,
  uploadLoading,
  onUpload,
}: ResumeUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.step}>
          <span className={styles.stepNum}>1</span>
          <span className={styles.stepLabel}>Upload your resume</span>
        </div>
        {resumeText && <span className={styles.status}>✓ Ready</span>}
      </div>

      <div
        className={`${styles.zone} ${resumeText ? styles.zoneUploaded : ""}`}
        onClick={() => fileRef.current?.click()}
      >
        {uploadLoading ? (
          <div className={styles.spinner} />
        ) : resumeText ? (
          <>
            <div className={`${styles.icon} ${styles.iconDone}`}>📄</div>
            <div className={styles.title}>{resumeName}</div>
            <div className={styles.sub}>Click to replace your resume</div>
          </>
        ) : (
          <>
            <div className={`${styles.icon} ${styles.iconIdle}`}>⬆</div>
            <div className={styles.title}>Drop your resume here</div>
            <div className={styles.sub}>PDF only · stays on your device</div>
          </>
        )}
      </div>

      {!resumeText && (
        <div className={styles.tags}>
          {["ATS-ready", "PDF format", "Any template"].map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={onUpload}
      />
    </div>
  );
}