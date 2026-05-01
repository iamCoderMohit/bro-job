document.addEventListener("DOMContentLoaded", () => {
  // ─── Elements ───────────────────────────────────────────────────────────────
  const uploadZone    = document.getElementById("upload-zone");
  const resumeInput   = document.getElementById("resume-input");
  const resumeBadge   = document.getElementById("resume-badge");
  const uploadTitle   = document.getElementById("upload-title");
  const uploadSub     = document.getElementById("upload-sub");

  const pageInfo      = document.getElementById("page-info");
  const analyseBtn    = document.getElementById("analyse-btn");

  const errorBanner   = document.getElementById("error-banner");
  const errorMessage  = document.getElementById("error-message");

  const resultsDiv    = document.getElementById("results");
  const summaryBox    = document.getElementById("summary-box");
  const matchSection  = document.getElementById("match-section");
  const scorePill     = document.getElementById("score-pill");
  const reasoning     = document.getElementById("reasoning");
  const gapsSection   = document.getElementById("gaps-section");
  const gaps          = document.getElementById("gaps");

  // ─── State ──────────────────────────────────────────────────────────────────
  let resumeText = null;
  let jobText    = null;

  // ─── Init ────────────────────────────────────────────────────────────────────
  (async () => {
    await loadStoredResume();
    await grabJobText();
  })();

  // ─── Resume: load from storage ───────────────────────────────────────────────
  async function loadStoredResume() {
    const stored = await chrome.storage.local.get(["resumeText", "resumeName"]);
    if (stored.resumeText) {
      resumeText = stored.resumeText;
      showResumeStored(stored.resumeName || "Resume");
    }   
  }

  // ─── Resume: upload ──────────────────────────────────────────────────────────
  uploadZone.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    resumeInput.value = ""
    setTimeout(() => resumeInput.click(), 10);
  });

  uploadZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.classList.add("drag-over");
  });

  uploadZone.addEventListener("dragleave", () => {
    uploadZone.classList.remove("drag-over");
  });

  uploadZone.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadZone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file) handleResumeFile(file);
  });

  resumeInput.addEventListener("change", () => {
    const file = resumeInput.files[0];
    if (file) handleResumeFile(file);
  });

  async function handleResumeFile(file) {
    if (file.type !== "application/pdf") {
      showError("Only PDF files are supported.");
      return;
    }

    resumeInput.value = ""
    showResumeLoading();
    hideError();

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch(`${CONFIG.API_BASE_URL}/api/parse-resume`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to parse resume.");

      resumeText = data.resumeText;
      await chrome.storage.local.set({
        resumeText: data.resumeText,
        resumeName: file.name,
      });

      showResumeStored(file.name);
      hideError();
    } catch (err) {
      showError(err.message);
      showResumeEmpty();
    }
  }

  // ─── Job text: grab from current tab ─────────────────────────────────────────
  async function grabJobText() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const selectors = [
            ".job-view-layout",
            ".jobsearch-JobComponent",
            "[data-testid='job-detail']",
            ".job-description",
            "#job-description",
            "article",
            "main",
          ];

          for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && el.innerText.trim().length > 100) {
              return el.innerText.trim();
            }
          }

          return document.body.innerText.trim();
        },
      });

      if (result && result.length > 100) {
        jobText = result;
        pageInfo.textContent = "Job description detected ✓";
        pageInfo.classList.add("detected");
        analyseBtn.disabled = false;
      } else {
        pageInfo.textContent = "No job description detected on this page.";
        analyseBtn.disabled = true;
      }
    } catch (err) {
      console.error("grabJobText error:", err);
      pageInfo.textContent = "Could not read this page.";
      analyseBtn.disabled = true;
    }
  }

  // ─── Analyse ──────────────────────────────────────────────────────────────────
  analyseBtn.addEventListener("click", async () => {
    hideError();
    hideResults();
    analyseBtn.disabled = true;
    analyseBtn.textContent = "Analysing…";

    try {
      // Always summarize
      const summaryRes = await fetch(`${CONFIG.API_BASE_URL}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jobText }),
      });

      const summaryData = await summaryRes.json();
      if (!summaryRes.ok) throw new Error(summaryData.error || "Summarization failed.");

      summaryBox.textContent = summaryData.summary;

      // Match only if resume is uploaded
      if (resumeText) {
        const matchRes = await fetch(`${CONFIG.API_BASE_URL}/api/match`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobDescription: jobText, resumeText }),
        });

        const matchData = await matchRes.json();
        if (!matchRes.ok) throw new Error(matchData.error || "Match failed.");

        const { score, reasoning: reason, missingSkills } = matchData.match;

        scorePill.textContent = score;
        scorePill.className   = `score-pill score--${score.toLowerCase()}`;
        reasoning.textContent = reason;

        gaps.innerHTML = "";
        if (missingSkills && missingSkills.length > 0) {
          missingSkills.forEach((skill) => {
            const tag = document.createElement("span");
            tag.className   = "gap-tag";
            tag.textContent = skill;
            gaps.appendChild(tag);
          });
          gapsSection.style.display = "block";
        } else {
          gapsSection.style.display = "none";
        }

        matchSection.style.display = "block";
      } else {
        matchSection.style.display = "none";
      }

      showResults();
    } catch (err) {
      showError(err.message);
    } finally {
      analyseBtn.disabled = false;
      analyseBtn.textContent = "Analyse Job →";
    }
  });

  // ─── UI helpers ───────────────────────────────────────────────────────────────
  function showResumeLoading() {
    uploadTitle.textContent    = "Parsing resume…";
    uploadSub.textContent      = "";
    resumeBadge.style.display  = "none";
    uploadZone.classList.remove("stored");
  }

  function showResumeStored(name) {
    uploadTitle.textContent    = name;
    uploadSub.textContent      = "✓ Saved locally · click to replace";
    resumeBadge.style.display  = "inline-block";
    uploadZone.classList.add("stored");
  }

  function showResumeEmpty() {
    uploadTitle.textContent    = "Upload your resume";
    uploadSub.textContent      = "PDF only · saved locally";
    resumeBadge.style.display  = "none";
    uploadZone.classList.remove("stored");
  }

  function showError(msg) {
    errorMessage.textContent    = msg;
    errorBanner.style.display   = "flex";
  }

  function hideError() {
    errorBanner.style.display = "none";
  }

  function showResults() {
    resultsDiv.style.display = "block";
  }

  function hideResults() {
    resultsDiv.style.display = "none";
  }
});