"use client";

import { useState } from "react";
import ResumeUpload from "@/components/ResumeUpload";
import JobInput from "@/components/JobInput";
import Results from "@/components/Results";
import ErrorBanner from "@/components/ErrorBanner";
import styles from "./page.module.css";

type MatchResult = {
  score: "Strong" | "Moderate" | "Weak";
  reasoning: string;
  missingSkills: string[];
};

type Result = {
  summary: string;
  match: MatchResult | null;
};

export default function Dashboard() {
  const [resumeText, setResumeText] = useState<string>("");
  const [resumeName, setResumeName] = useState<string>("");
  const [jd, setJd] = useState<string>("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to parse resume");

      setResumeText(data.resumeText);
      setResumeName(file.name);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload resume");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleAnalyse = async () => {
    if (!jd.trim()) { setError("Paste a job description first"); return; }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const sumRes = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jd }),
      });
      const sumData = await sumRes.json();
      if (!sumRes.ok) throw new Error(sumData.error || "Failed to summarize");

      let match: MatchResult | null = null;
      if (resumeText) {
        const matchRes = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobDescription: jd, resumeText }),
        });
        const matchData = await matchRes.json();
        if (!matchRes.ok) throw new Error(matchData.error || "Failed to match");
        match = matchData.match;
      }

      setResult({ summary: sumData.summary, match });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1 className={styles.title}>Analyse a Job</h1>
        <p className={styles.subtitle}>
          Upload your resume once, paste any job description, get an instant summary and fit score.
        </p>
      </div>

      <ResumeUpload
        resumeText={resumeText}
        resumeName={resumeName}
        uploadLoading={uploadLoading}
        onUpload={handleResumeUpload}
      />

      <JobInput jd={jd} onChange={setJd} />

      <ErrorBanner message={error} />

      <button
        className={`${styles.btn} ${loading ? styles.btnLoading : ""}`}
        onClick={handleAnalyse}
        disabled={loading || !jd.trim()}
      >
        {loading ? (
          <span className={styles.dots}>
            <span>•</span><span>•</span><span>•</span>
          </span>
        ) : "Analyse Job →"}
      </button>

      {!resumeText && (
        <p className={styles.note}>
          No resume? You'll still get the summary — upload for a fit score.
        </p>
      )}

      {result && <Results result={result} />}
    </div>
  );
}