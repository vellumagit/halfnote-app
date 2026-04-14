import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateSessionSummary(
  notes: string,
  transcript?: string
): Promise<string> {
  const content = [
    notes ? `## Session Notes\n${notes}` : "",
    transcript ? `## Transcript\n${transcript}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  if (!content.trim()) {
    throw new Error("No notes or transcript provided to summarize.");
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: `You are a clinical note assistant for a spiritual healing practitioner.
Given the session notes and/or transcript below, produce a structured summary with these sections:

1. **Key Themes** — The main topics or issues discussed (2-4 bullet points)
2. **Client State** — A brief observation of the client's emotional/energetic state during the session (1-2 sentences)
3. **Modalities Used** — Any healing techniques, exercises, or approaches mentioned (list)
4. **Insights & Breakthroughs** — Any notable realizations or shifts (1-2 sentences, or "None noted" if not apparent)
5. **Follow-Up Actions** — Specific things to address, homework for the client, or preparation for next session (bullet points)

Keep the tone professional but warm. Be concise. Do not invent details not present in the source material.`,
    messages: [{ role: "user", content }],
  });

  const block = message.content[0];
  if (block.type === "text") return block.text;
  throw new Error("Unexpected response format");
}

export async function generateClientRecap(
  clientName: string,
  sessionSummaries: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: `You are a clinical note assistant for a spiritual healing practitioner.
Given the chronological session summaries below for this client, produce a holistic overview:

1. **Journey Overview** — A 2-3 sentence narrative of this client's progression across sessions
2. **Recurring Themes** — Patterns or topics that keep coming up
3. **Progress Noted** — Shifts, growth, or breakthroughs observed over time
4. **Current Focus** — What the most recent sessions suggest the current work is about
5. **Suggested Next Steps** — Based on the trajectory, what might be worth exploring next

Be concise and grounded in the actual notes. Do not speculate beyond what the data supports.`,
    messages: [
      {
        role: "user",
        content: `Client: ${clientName}\n\n${sessionSummaries}`,
      },
    ],
  });

  const block = message.content[0];
  if (block.type === "text") return block.text;
  throw new Error("Unexpected response format");
}
