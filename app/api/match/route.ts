import { NextRequest, NextResponse } from "next/server";
import { matchJDToResume } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobDescription, resumeText } = body;

    if (!jobDescription || typeof jobDescription !== "string") {
      return NextResponse.json(
        { error: "jobDescription is required" },
        { status: 400 }
      );
    }

    if (!resumeText || typeof resumeText !== "string") {
      return NextResponse.json(
        { error: "resumeText is required" },
        { status: 400 }
      );
    }

    if (jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: "Job description is too short" },
        { status: 400 }
      );
    }

    if (resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Resume text is too short" },
        { status: 400 }
      );
    }

    const match = await matchJDToResume(jobDescription, resumeText);

    return NextResponse.json({ match });
  } catch (error) {
    console.error("[match] error:", error);
    return NextResponse.json(
      { error: "Failed to match job description against resume" },
      { status: 500 }
    );
  }
}