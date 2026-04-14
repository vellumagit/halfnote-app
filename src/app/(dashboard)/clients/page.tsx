import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { format } from "date-fns";
import { ClientSearch } from "@/components/clients/client-search";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; tag?: string }>;
}) {
  const { search = "", tag = "" } = await searchParams;

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (tag) {
    where.tags = { contains: tag };
  }

  const clients = await prisma.client.findMany({
    where,
    include: {
      sessions: { orderBy: { date: "desc" }, take: 1, select: { date: true } },
      _count: { select: { sessions: true } },
      invoices: {
        where: { status: { in: ["sent", "overdue"] } },
        select: { amount: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const tagColor: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    new: "bg-blue-100 text-blue-700",
    paused: "bg-amber-100 text-amber-700",
    completed: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Clients</h1>
          <p className="mt-1 text-muted-foreground">
            {clients.length} client{clients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/clients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      <ClientSearch initialSearch={search} initialTag={tag} />

      {clients.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {search || tag
                ? "No clients match your search."
                : "No clients yet — add your first client to get started."}
            </p>
            {!search && !tag && (
              <Link href="/clients/new">
                <Button variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {clients.map((client) => {
            const lastSession = client.sessions[0]?.date;
            const outstanding = client.invoices.reduce(
              (s, i) => s + i.amount,
              0
            );
            return (
              <Link key={client.id} href={`/clients/${client.id}`}>
                <Card className="transition-colors hover:bg-accent/50">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-medium">
                        {client.firstName[0]}
                        {client.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium">
                          {client.firstName} {client.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {client.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <Badge className={tagColor[client.tags] ?? "bg-gray-100 text-gray-700"}>
                        {client.tags}
                      </Badge>
                      <div className="hidden text-right sm:block">
                        <p className="text-muted-foreground">
                          {client._count.sessions} session
                          {client._count.sessions !== 1 ? "s" : ""}
                        </p>
                        {lastSession && (
                          <p className="text-xs text-muted-foreground">
                            Last: {format(new Date(lastSession), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                      {outstanding > 0 && (
                        <Badge variant="destructive" className="hidden md:inline-flex">
                          ${outstanding.toFixed(2)} owing
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
