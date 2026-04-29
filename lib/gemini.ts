const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const geminiRequest = async (prompt: string, retries = 3): Promise<string> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3 },
      }),
    });

    // rate limited — wait and retry
    if (res.status === 429) {
      if (attempt === retries) {
        throw new Error("Gemini rate limit reached. Please try again in a moment.");
      }
      const delay = 5000 * attempt; // 5s, 10s, 15s
      console.warn(`[gemini] 429 rate limited, retrying in ${delay}ms (attempt ${attempt}/${retries})`);
      await sleep(delay);
      continue;
    }

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.candidates[0].content.parts[0].text as string;
  }

  throw new Error("Gemini request failed after all retries");
};

// ---- Summarize a job description into 2 sentences ----
export const summarizeJD = async (jobDescription: string): Promise<string> => {
  const prompt = `
You are helping a job seeker quickly understand a job posting.
Summarize the following job description in exactly 2 sentences.
Sentence 1: What the role is, at what kind of company, and the most important requirement.
Sentence 2: The work environment, culture, or anything the candidate should know before applying.
Be direct and specific. No filler words. No "This role..." or "The company..." preamble.

Job Description:
${jobDescription}
  `.trim();

  return geminiRequest(prompt);
};

// ---- Match a job description against a resume ----
export type MatchResult = {
  score: "Strong" | "Moderate" | "Weak";
  reasoning: string; // one sentence
  missingSkills: string[]; // top 3 gaps, empty if strong match
};

export const matchJDToResume = async (
  jobDescription: string,
  resumeText: string
): Promise<MatchResult> => {
  const prompt = `
You are evaluating how well a candidate's resume matches a job description.
Respond ONLY with a valid JSON object, no markdown, no explanation outside the JSON.

Return this exact shape:
{
  "score": "Strong" | "Moderate" | "Weak",
  "reasoning": "One sentence explaining the score.",
  "missingSkills": ["skill1", "skill2"] // up to 3 gaps, empty array if Strong
}

Job Description:
${jobDescription}

Resume:
${resumeText}
  `.trim();

  const raw = await geminiRequest(prompt);

  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean) as MatchResult;
  } catch {
    throw new Error("Failed to parse match result from Gemini");
  }
};