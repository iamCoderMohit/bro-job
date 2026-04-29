import { NextRequest, NextResponse } from "next/server";
import { summarizeJD } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobDescription } = body;

    if (!jobDescription || typeof jobDescription !== "string") {
      return NextResponse.json(
        { error: "jobDescription is required" },
        { status: 400 }
      );
    }

    if (jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: "Job description is too short" },
        { status: 400 }
      );
    }

    const summary = await summarizeJD(jobDescription);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("[summarize] error:", error);
    return NextResponse.json(
      { error: "Failed to summarize job description" },
      { status: 500 }
    );
  }
}