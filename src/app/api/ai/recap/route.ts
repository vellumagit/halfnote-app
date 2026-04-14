import { generateClientRecap } from "@/lib/anthropic";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { clientId } = await request.json();
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const sessions = await prisma.session.findMany({
      where: { clientId, status: "completed" },
      orderBy: { date: "asc" },
    });

    const summaries = sessions
      .map((s, i) => {
        const content = s.summary || s.notes || "";
        if (!content) return "";
        return `### Session ${i + 1} — ${new Date(s.date).toLocaleDateString()}\n${content}`;
      })
      .filter(Boolean)
      .join("\n\n");

    if (!summaries) {
      return NextResponse.json(
        { error: "No session data available for recap" },
        { status: 400 }
      );
    }

    const recap = await generateClientRecap(
      `${client.firstName} ${client.lastName}`,
      summaries
    );
    return NextResponse.json({ recap });
  } catch (error) {
    console.error("AI recap error:", error);
    return NextResponse.json(
      { error: "Failed to generate recap" },
      { status: 500 }
    );
  }
}
