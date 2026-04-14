"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { ClientEditDialog } from "./client-edit-dialog";

interface ClientActionsProps {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    dateOfBirth: Date | null;
    intakeNotes: string | null;
    tags: string;
  };
}

export function ClientActions({ client }: ClientActionsProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete ${client.firstName} ${client.lastName}? This cannot be undone.`)) return;
    const res = await fetch(`/api/clients/${client.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Client deleted");
      router.push("/clients");
      router.refresh();
    } else {
      toast.error("Failed to delete client");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Client
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Client
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ClientEditDialog
        client={client}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
