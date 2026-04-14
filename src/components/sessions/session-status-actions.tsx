"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle2, XCircle, AlertTriangle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SessionStatusActions({
  sessionId,
  currentStatus,
}: {
  sessionId: string;
  currentStatus: string;
}) {
  const router = useRouter();

  const updateStatus = async (status: string) => {
    const res = await fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success(`Session marked as ${status}`);
      router.refresh();
    } else {
      toast.error("Failed to update session");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this session? This cannot be undone.")) return;
    const res = await fetch(`/api/sessions/${sessionId}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Session deleted");
      router.push("/sessions");
    } else {
      toast.error("Failed to delete session");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currentStatus !== "completed" && (
          <DropdownMenuItem onClick={() => updateStatus("completed")}>
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
            Mark Complete
          </DropdownMenuItem>
        )}
        {currentStatus !== "cancelled" && (
          <DropdownMenuItem onClick={() => updateStatus("cancelled")}>
            <XCircle className="mr-2 h-4 w-4 text-gray-500" />
            Mark Cancelled
          </DropdownMenuItem>
        )}
        {currentStatus !== "no-show" && (
          <DropdownMenuItem onClick={() => updateStatus("no-show")}>
            <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
            Mark No-Show
          </DropdownMenuItem>
        )}
        {currentStatus !== "scheduled" && (
          <DropdownMenuItem onClick={() => updateStatus("scheduled")}>
            Revert to Scheduled
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Session
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
