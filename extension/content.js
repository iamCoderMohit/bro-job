// Runs on every page. Listens for a message from popup.js
// asking for the job description text from the current page.

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "GET_JOB_TEXT") return;

  const text = extractJobText();
  sendResponse({ text });

  // return true to keep the message channel open for async use
  return true;
});

function extractJobText() {
  // Try common job description containers first
  // These selectors cover LinkedIn, Greenhouse, Lever, Indeed, Workday
  const selectors = [
    // LinkedIn
    ".job-view-layout",
    ".jobs-description__content",
    // Greenhouse
    "#content",
    ".job-post",
    // Lever
    ".posting-page",
    ".content-wrapper",
    // Indeed
    "#jobDescriptionText",
    ".jobsearch-jobDescriptionText",
    // Workday
    "[data-automation-id='jobPostingDescription']",
    // Generic fallbacks
    "article",
    "main",
    "[class*='job-description']",
    "[class*='jobDescription']",
    "[id*='job-description']",
    "[id*='jobDescription']",
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) {
      const text = el.innerText.trim();
      if (text.length > 100) return text;
    }
  }

  // Last resort — grab all visible body text
  return document.body.innerText.trim();
}