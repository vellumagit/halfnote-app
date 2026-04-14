import { generateSessionSummary } from "@/lib/anthropic";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { notes, transcript } = await request.json();
    if (!notes && !transcript) {
      return NextResponse.json(
        { error: "Notes or transcript required" },
        { status: 400 }
      );
    }
    const summary = await generateSessionSummary(notes, transcript);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI summary error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
