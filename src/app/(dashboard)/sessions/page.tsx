import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { format } from "date-fns";

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const sessions = await prisma.session.findMany({
    where,
    include: { client: true },
    orderBy: { date: "desc" },
  });

  const statusColor: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-500",
    "no-show": "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Sessions</h1>
          <p className="mt-1 text-muted-foreground">
            {sessions.length} session{sessions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/sessions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Session
          </Button>
        </Link>
      </div>

      {/* Status filter */}
      <div className="flex gap-2">
        {[
          { label: "All", value: "" },
          { label: "Scheduled", value: "scheduled" },
          { label: "Completed", value: "completed" },
          { label: "Cancelled", value: "cancelled" },
        ].map((f) => (
          <Link key={f.value} href={`/sessions${f.value ? `?status=${f.value}` : ""}`}>
            <Button
              variant={status === f.value || (!status && !f.value) ? "default" : "outline"}
              size="sm"
            >
              {f.label}
            </Button>
          </Link>
        ))}
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No sessions found.</p>
            <Link href="/sessions/new">
              <Button variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Schedule a Session
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => (
            <Link key={session.id} href={`/sessions/${session.id}`}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                      {session.client.firstName[0]}
                      {session.client.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium">
                        {session.client.firstName} {session.client.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(session.date), "EEE, MMM d, yyyy · h:mm a")}{" "}
                        · {session.duration} min · {session.type}
                      </p>
                    </div>
                  </div>
                  <Badge className={statusColor[session.status] ?? ""}>
                    {session.status}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
