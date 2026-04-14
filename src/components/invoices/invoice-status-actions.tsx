"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Send, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function InvoiceStatusActions({
  invoiceId,
  currentStatus,
}: {
  invoiceId: string;
  currentStatus: string;
}) {
  const router = useRouter();

  const updateStatus = async (status: string) => {
    const res = await fetch(`/api/invoices/${invoiceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success(`Invoice marked as ${status}`);
      router.refresh();
    } else {
      toast.error("Failed to update invoice");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    const res = await fetch(`/api/invoices/${invoiceId}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Invoice deleted");
      router.push("/invoices");
    } else {
      toast.error("Failed to delete invoice");
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
        {currentStatus === "draft" && (
          <DropdownMenuItem onClick={() => updateStatus("sent")}>
            <Send className="mr-2 h-4 w-4 text-blue-600" />
            Mark as Sent
          </DropdownMenuItem>
        )}
        {(currentStatus === "sent" || currentStatus === "overdue") && (
          <DropdownMenuItem onClick={() => updateStatus("paid")}>
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
            Mark as Paid
          </DropdownMenuItem>
        )}
        {currentStatus !== "cancelled" && currentStatus !== "paid" && (
          <DropdownMenuItem onClick={() => updateStatus("cancelled")}>
            <XCircle className="mr-2 h-4 w-4 text-gray-500" />
            Cancel Invoice
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Invoice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
