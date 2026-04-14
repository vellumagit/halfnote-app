"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ClientRecapButton({ clientId }: { clientId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recap, setRecap] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setRecap("");
    try {
      const res = await fetch("/api/ai/recap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecap(data.recap);
      } else {
        toast.error(data.error || "Failed to generate recap");
      }
    } catch {
      toast.error("Network error");
    }
    setLoading(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setOpen(true);
          handleGenerate();
        }}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Generate Recap
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Client Journey Recap</DialogTitle>
          </DialogHeader>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              <span className="ml-3 text-muted-foreground">
                Generating recap...
              </span>
            </div>
          ) : recap ? (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
              {recap}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No recap data available.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
