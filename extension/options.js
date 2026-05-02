document.addEventListener("DOMContentLoaded", () => {
  const uploadZone  = document.getElementById("upload-zone");
  const resumeInput = document.getElementById("resume-input");
  const uploadTitle = document.getElementById("upload-title");
  const uploadSub   = document.getElementById("upload-sub");
  const errorBanner = document.getElementById("error-banner");
  const errorMsg    = document.getElementById("error-message");

  // Load existing resume on open
  chrome.storage.local.get(["resumeName"], (stored) => {
    if (stored.resumeName) {
      uploadTitle.textContent = stored.resumeName;
      uploadSub.textContent   = "✓ Saved · click to replace";
      uploadZone.classList.add("stored");
    }
  });

  uploadZone.addEventListener("click", () => {
    resumeInput.value = "";
    resumeInput.click();
  });

  resumeInput.addEventListener("change", () => {
    const file = resumeInput.files[0];
    if (file) handleFile(file);
  });

  async function handleFile(file) {
    if (file.type !== "application/pdf") {
      errorMsg.textContent      = "Only PDF files are supported.";
      errorBanner.style.display = "flex";
      return;
    }

    uploadTitle.textContent   = "Parsing…";
    uploadSub.textContent     = "";
    errorBanner.style.display = "none";

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res  = await fetch(`${CONFIG.API_BASE_URL}/api/parse-resume`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to parse resume.");

      await chrome.storage.local.set({
        resumeText: data.resumeText,
        resumeName: file.name,
      });

      uploadTitle.textContent = file.name;
      uploadSub.textContent   = "✓ Saved · click to replace";
      uploadZone.classList.add("stored");
    } catch (err) {
      errorMsg.textContent      = err.message;
      errorBanner.style.display = "flex";
      uploadTitle.textContent   = "Click to upload PDF";
      uploadSub.textContent     = "PDF only · saved locally";
    }
  }
});