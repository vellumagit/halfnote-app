"use client";

import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

interface SessionNotesEditorProps {
  sessionId: string;
  initialNotes: string;
  field?: string;
  placeholder?: string;
}

export function SessionNotesEditor({
  sessionId,
  initialNotes,
  field = "notes",
  placeholder = "Write your session notes here...",
}: SessionNotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const save = useCallback(
    async (value: string) => {
      setSaving(true);
      try {
        await fetch(`/api/sessions/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: value }),
        });
      } catch {
        toast.error("Failed to save");
      }
      setSaving(false);
    },
    [sessionId, field]
  );

  const handleChange = (value: string) => {
    setNotes(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => save(value), 3000);
  };

  const handleBlur = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (notes !== initialNotes) save(notes);
  };

  return (
    <div className="relative">
      <Textarea
        value={notes}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={8}
        className="min-h-[150px] resize-y"
      />
      {saving && (
        <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          Saving...
        </span>
      )}
    </div>
  );
}
