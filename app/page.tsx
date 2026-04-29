"use client";

import { useState, useRef } from "react";

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
  Strong:   { color: "#00c896", label: "Strong Match",   bg: "rgba(0,200,150,0.08)"  },
  Moderate: { color: "#f5a623", label: "Moderate Match", bg: "rgba(245,166,35,0.08)" },
  Weak:     { color: "#e05c5c", label: "Weak Match",     bg: "rgba(224,92,92,0.08)"  },
};

export default function Home() {
  const [resumeText, setResumeText]   = useState<string>("");
  const [resumeName, setResumeName]   = useState<string>("");
  const [jd, setJd]                   = useState<string>("");
  const [result, setResult]           = useState<Result | null>(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string>("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Upload resume ──────────────────────────────────────────
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

  // ── Analyse job description ────────────────────────────────
  const handleAnalyse = async () => {
    if (!jd.trim()) { setError("Paste a job description first"); return; }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // always summarise
      const sumRes  = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jd }),
      });
      const sumData = await sumRes.json();
      if (!sumRes.ok) throw new Error(sumData.error || "Failed to summarize");

      // match only if resume uploaded
      let match: MatchResult | null = null;
      if (resumeText) {
        const matchRes  = await fetch("/api/match", {
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:       #0b0c0e;
          --surface:  #111318;
          --border:   #1f2128;
          --border2:  #2a2d38;
          --text:     #e8eaf0;
          --muted:    #6b7280;
          --accent:   #4f7cff;
          --accent2:  #00c896;
          --font-display: 'Syne', sans-serif;
          --font-mono:    'DM Mono', monospace;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-mono);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          opacity: .025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        .wrap {
          position: relative; z-index: 1;
          max-width: 720px;
          margin: 0 auto;
          padding: 64px 24px 120px;
        }

        /* ── Header ── */
        .header { margin-bottom: 56px; }
        .badge {
          display: inline-block;
          font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
          color: var(--accent); border: 1px solid rgba(79,124,255,.3);
          padding: 4px 10px; border-radius: 4px; margin-bottom: 20px;
        }
        h1 {
          font-family: var(--font-display);
          font-size: clamp(2rem, 6vw, 3.2rem);
          font-weight: 800; line-height: 1.1;
          letter-spacing: -.02em;
        }
        h1 span { color: var(--accent); }
        .subtitle {
          margin-top: 14px; font-size: 14px;
          color: var(--muted); line-height: 1.6;
        }

        /* ── Cards ── */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 16px;
          transition: border-color .2s;
        }
        .card:focus-within { border-color: var(--border2); }

        .card-label {
          font-size: 11px; letter-spacing: .1em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .card-label .step {
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--border2); color: var(--text);
          font-size: 10px; display: grid; place-items: center;
          font-family: var(--font-display); font-weight: 700;
        }

        /* ── Resume upload ── */
        .upload-zone {
          border: 1.5px dashed var(--border2);
          border-radius: 8px; padding: 28px;
          text-align: center; cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .upload-zone:hover { border-color: var(--accent); background: rgba(79,124,255,.04); }
        .upload-zone.uploaded { border-color: var(--accent2); border-style: solid; background: rgba(0,200,150,.04); }
        .upload-icon { font-size: 28px; margin-bottom: 10px; }
        .upload-text { font-size: 13px; color: var(--muted); }
        .upload-text strong { color: var(--text); display: block; margin-bottom: 4px; font-weight: 500; }
        .file-name {
          margin-top: 10px; font-size: 12px;
          color: var(--accent2); display: flex; align-items: center;
          justify-content: center; gap: 6px;
        }

        /* ── Textarea ── */
        textarea {
          width: 100%; background: transparent;
          border: none; outline: none; resize: none;
          color: var(--text); font-family: var(--font-mono);
          font-size: 13px; line-height: 1.7;
          min-height: 160px;
        }
        textarea::placeholder { color: var(--muted); }

        /* ── Button ── */
        .btn {
          width: 100%; padding: 16px;
          background: var(--accent);
          color: #fff; border: none; border-radius: 10px;
          font-family: var(--font-display);
          font-size: 15px; font-weight: 700;
          letter-spacing: .02em; cursor: pointer;
          transition: opacity .15s, transform .1s;
          margin-top: 4px;
        }
        .btn:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
        .btn:active:not(:disabled) { transform: translateY(0); }
        .btn:disabled { opacity: .4; cursor: not-allowed; }

        /* ── Error ── */
        .error {
          font-size: 13px; color: #e05c5c;
          background: rgba(224,92,92,.08);
          border: 1px solid rgba(224,92,92,.2);
          border-radius: 8px; padding: 12px 16px;
          margin-bottom: 16px;
        }

        /* ── Results ── */
        .results { margin-top: 32px; animation: fadeUp .4s ease; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .result-label {
          font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 10px;
        }

        .summary-box {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; padding: 24px; margin-bottom: 16px;
        }
        .summary-text {
          font-size: 14px; line-height: 1.75; color: var(--text);
        }

        .match-box {
          border-radius: 12px; padding: 24px;
          border: 1px solid;
        }
        .match-header {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 14px;
        }
        .score-pill {
          font-family: var(--font-display);
          font-size: 13px; font-weight: 700;
          padding: 5px 14px; border-radius: 20px;
          border: 1.5px solid;
        }
        .reasoning {
          font-size: 13px; color: var(--muted);
          line-height: 1.6; margin-bottom: 16px;
        }
        .gaps-label {
          font-size: 11px; letter-spacing: .1em;
          text-transform: uppercase; color: var(--muted);
          margin-bottom: 8px;
        }
        .gaps { display: flex; flex-wrap: wrap; gap: 8px; }
        .gap-tag {
          font-size: 12px; padding: 4px 12px;
          border-radius: 6px; border: 1px solid var(--border2);
          color: var(--muted);
        }

        /* ── Loading dots ── */
        .dots span {
          display: inline-block; animation: blink 1.2s infinite;
          font-size: 20px; line-height: 1;
        }
        .dots span:nth-child(2) { animation-delay: .2s; }
        .dots span:nth-child(3) { animation-delay: .4s; }
        @keyframes blink {
          0%, 80%, 100% { opacity: .2; }
          40%            { opacity: 1;  }
        }

        .divider {
          height: 1px; background: var(--border);
          margin: 28px 0;
        }

        .no-resume-note {
          font-size: 12px; color: var(--muted);
          text-align: center; margin-top: 10px;
        }
        .no-resume-note a {
          color: var(--accent); cursor: pointer;
          text-decoration: underline; text-underline-offset: 3px;
        }
      `}</style>

      <div className="grain" />

      <div className="wrap">
        {/* Header */}
        <div className="header">
          <div className="badge">Job Description Decoder</div>
          <h1>Stop reading<br /><span>wall-of-text</span> JDs.</h1>
          <p className="subtitle">
            Paste any job description. Get a 2-sentence summary and an instant<br />
            fit score against your resume.
          </p>
        </div>

        {/* Step 1 — Resume */}
        <div className="card">
          <div className="card-label">
            <span className="step">1</span>
            Upload your resume
            {resumeText && <span style={{ color: "var(--accent2)", marginLeft: "auto", fontSize: "11px" }}>✓ ready</span>}
          </div>

          <div
            className={`upload-zone ${resumeText ? "uploaded" : ""}`}
            onClick={() => fileRef.current?.click()}
          >
            {uploadLoading ? (
              <div className="dots"><span>•</span><span>•</span><span>•</span></div>
            ) : resumeText ? (
              <>
                <div className="upload-icon">📄</div>
                <div className="file-name">✓ {resumeName}</div>
                <div className="upload-text" style={{ marginTop: 6 }}>Click to replace</div>
              </>
            ) : (
              <>
                <div className="upload-icon">⬆</div>
                <div className="upload-text">
                  <strong>Drop your resume here</strong>
                  PDF only · your data stays local
                </div>
              </>
            )}
          </div>
          <input
            ref={fileRef} type="file" accept=".pdf"
            style={{ display: "none" }}
            onChange={handleResumeUpload}
          />
        </div>

        {/* Step 2 — JD */}
        <div className="card">
          <div className="card-label">
            <span className="step">2</span>
            Paste the job description
          </div>
          <textarea
            placeholder="Paste the full job description here..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button
          className="btn"
          onClick={handleAnalyse}
          disabled={loading || !jd.trim()}
        >
          {loading
            ? <span className="dots"><span>•</span><span>•</span><span>•</span></span>
            : "Analyse Job →"
          }
        </button>

        {!resumeText && (
          <p className="no-resume-note">
            No resume? You'll still get the summary.{" "}
            <a onClick={() => fileRef.current?.click()}>Upload for fit score →</a>
          </p>
        )}

        {/* Results */}
        {result && (
          <div className="results">
            <div className="divider" />

            <div className="result-label">Summary</div>
            <div className="summary-box">
              <p className="summary-text">{result.summary}</p>
            </div>

            {result.match && (() => {
              const cfg = scoreConfig[result.match.score];
              return (
                <>
                  <div className="result-label" style={{ marginTop: 20 }}>Fit Score</div>
                  <div
                    className="match-box"
                    style={{ background: cfg.bg, borderColor: cfg.color + "44" }}
                  >
                    <div className="match-header">
                      <span style={{ fontSize: 13, color: "var(--muted)" }}>Your resume vs this role</span>
                      <span
                        className="score-pill"
                        style={{ color: cfg.color, borderColor: cfg.color + "55" }}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    <p className="reasoning">{result.match.reasoning}</p>

                    {result.match.missingSkills.length > 0 && (
                      <>
                        <div className="gaps-label">Gaps to address</div>
                        <div className="gaps">
                          {result.match.missingSkills.map((s) => (
                            <span key={s} className="gap-tag">{s}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </>
  );
}