"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SessionSummary({
  sessionId,
  initialSummary,
  notes,
  transcript,
}: {
  sessionId: string;
  initialSummary: string;
  notes: string;
  transcript: string;
}) {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!notes && !transcript) {
      toast.error("Add notes or a transcript first");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, transcript }),
      });
      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
        // Save summary to session
        await fetch(`/api/sessions/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ summary: data.summary }),
        });
        toast.success("Summary generated");
      } else {
        toast.error(data.error || "Failed to generate summary");
      }
    } catch {
      toast.error("Network error");
    }
    setLoading(false);
  };

  return (
    <div>
      {summary ? (
        <div className="space-y-3">
          <div className="rounded-md bg-purple-50 p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {summary}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Regenerate Summary
          </Button>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground mb-3">
            Generate an AI summary from your notes and transcript.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Summary
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
