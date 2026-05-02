# bro.job

> Stop reading wall-of-text job posts.

Paste any job description and get a 2-sentence summary instantly. Upload your resume once and know if you're a strong fit — before you spend an hour applying.

**Live demo:** [bro.job](https://your-app.vercel.app) · **Chrome Extension:** [Download](#)

---

## The Problem

Job descriptions are long, repetitive, and deliberately vague. Most people spend 10–15 minutes reading a posting only to realise it's not a fit. Multiply that by 20 applications a week and you've wasted hours — before writing a single line of your cover letter.

bro.job fixes that in one click.

---

## Features

### Website

**Job Description Summariser**
Paste any job description and get a clean 2-sentence summary — role, company vibe, key requirements, nothing else. No fluff, no bullet soup.

**Resume Match Score**
Upload your resume once. Every job you analyse gets a fit score — Strong, Moderate, or Weak — with one line of reasoning and a list of skills you're missing. Know your chances before you apply.

**PDF Resume Parsing**
Upload your resume as a PDF. The app extracts the text automatically — no copy-pasting required.

**URL Fetching** *(coming soon)*
Paste a job posting URL and the app fetches and analyses it automatically. No manual copying at all.

**Saved History** *(coming soon)*
Every job you analyse gets saved so you can compare roles side by side and track what you've applied to.

---

### Chrome Extension

The extension is the core of bro.job. It works on any job site without you leaving the page.

**Works on Every Job Board**
LinkedIn, Indeed, Greenhouse, Lever, Naukri, Wellfound — if a job description is on the page, the extension finds it automatically.

**One Click Analysis**
Open the extension popup on any job page. It detects the job description, runs the summary and match score, and shows results in seconds.

**Resume Stored Locally**
Upload your resume once via the extension options page. It's saved in your browser's local storage — it never leaves your device except to match against a job you're actively analysing.

**No Tab Switching**
Everything happens in the popup. You never leave the job posting.

**Instant Setup**
No account. No sign up. Install the extension, upload your resume, and you're ready.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | CSS Modules |
| AI | Google Gemini 2.5 Flash |
| PDF Parsing | pdf2json |
| Hosting | Vercel |
| Extension | Chrome Manifest V3 |

---

## Project Structure

```
bro-job/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx
│   ├── globals.css
│   ├── dashboard/
│   │   └── page.tsx              # Main app — summarise + match
│   └── api/
│       ├── summarize/route.ts    # POST: summarise job description
│       ├── match/route.ts        # POST: match JD against resume
│       └── parse-resume/route.ts # POST: extract text from PDF
│
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── Features.tsx
│   ├── DownloadExtension.tsx
│   ├── Footer.tsx
│   ├── ResumeUpload.tsx
│   ├── JobInput.tsx
│   ├── Results.tsx
│   └── ErrorBanner.tsx
│
├── lib/
│   ├── gemini.ts                 # AI calls — summarise + match
│   └── resume-parser.ts          # PDF text extraction
│
└── extension/
    ├── manifest.json
    ├── popup.html
    ├── popup.css
    ├── popup.js                  # Main extension logic
    ├── options.html              # Resume upload page
    ├── options.js
    ├── content.js                # Reads job text from page
    ├── config.js                 # API base URL config
    └── icons/
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Google AI Studio](https://aistudio.google.com) account for the Gemini API key

### Installation

```bash
git clone https://github.com/yourusername/bro-job.git
cd bro-job
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Chrome Extension Setup

### Load in Chrome (Development)

1. Open `chrome://extensions`
2. Enable **Developer Mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder

### Configure API URL

In `extension/config.js`, set your backend URL:

```js
const CONFIG = {
  API_BASE_URL: "http://localhost:3000", // or your Vercel URL
};
```

### Using the Extension

1. Click the bro.job icon in your Chrome toolbar
2. Click the resume upload area to open the setup page
3. Upload your resume PDF — it's saved locally
4. Navigate to any job posting
5. Click the extension icon and hit **Analyse Job →**

---

## Deployment

### Deploy to Vercel

```bash
vercel deploy
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Update Extension for Production

In `extension/config.js`:
```js
const CONFIG = {
  API_BASE_URL: "https://your-app.vercel.app",
};
```

Update `extension/manifest.json` host_permissions:
```json
"host_permissions": [
  "https://your-app.vercel.app/*"
]
```

Re-zip and re-upload to the Chrome Web Store.

---

## AI Prompt Engineering

The quality of bro.job's output comes from carefully engineered prompts. The summariser is tuned to avoid generic AI phrasing and produce output that sounds like a human wrote it. The match prompt returns structured JSON with a score, one-line reasoning, and a list of specific missing skills — not a vague paragraph.

Both prompts went through multiple iterations to get the tone and specificity right. This is the core technical differentiator of the project.

---

## Roadmap

- [ ] URL fetching — paste a link, skip the copy-paste
- [ ] Saved job history with comparison view
- [ ] Firefox extension support
- [ ] Cover letter generator based on JD + resume match
- [ ] Shareable fit report link

---

## License

MIT