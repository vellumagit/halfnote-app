"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClipboardPaste } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SessionTranscript({
  sessionId,
  initialTranscript,
}: {
  sessionId: string;
  initialTranscript: string;
}) {
  const [transcript, setTranscript] = useState(initialTranscript);
  const [pasteValue, setPasteValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    const res = await fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: pasteValue }),
    });
    if (res.ok) {
      setTranscript(pasteValue);
      setOpen(false);
      toast.success("Transcript saved");
    } else {
      toast.error("Failed to save transcript");
    }
  };

  return (
    <div>
      {transcript ? (
        <div className="space-y-3">
          <div className="max-h-64 overflow-y-auto rounded-md border p-3 text-sm leading-relaxed whitespace-pre-wrap">
            {transcript}
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPasteValue(transcript)}
              >
                <ClipboardPaste className="mr-2 h-4 w-4" />
                Replace Transcript
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Paste Transcript</DialogTitle>
              </DialogHeader>
              <Textarea
                value={pasteValue}
                onChange={(e) => setPasteValue(e.target.value)}
                rows={15}
                placeholder="Paste your transcript here..."
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Transcript</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground mb-3">
            No transcript yet. Paste one from Fathom, Otter, or another tool.
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <Button variant="outline" size="sm">
                <ClipboardPaste className="mr-2 h-4 w-4" />
                Paste Transcript
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Paste Transcript</DialogTitle>
              </DialogHeader>
              <Textarea
                value={pasteValue}
                onChange={(e) => setPasteValue(e.target.value)}
                rows={15}
                placeholder="Paste your transcript here..."
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Transcript</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
