import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, FileText, Receipt, Plus, ArrowLeft, Sparkles } from "lucide-react";
import { ClientActions } from "@/components/clients/client-actions";
import { ClientRecapButton } from "@/components/clients/client-recap-button";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      sessions: {
        orderBy: { date: "desc" },
        include: { invoices: true },
      },
      invoices: { orderBy: { issuedDate: "desc" } },
    },
  });

  if (!client) notFound();

  const tagColor: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    new: "bg-blue-100 text-blue-700",
    paused: "bg-amber-100 text-amber-700",
    completed: "bg-purple-100 text-purple-700",
  };

  const statusColor: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-500",
    "no-show": "bg-red-100 text-red-700",
  };

  const invoiceStatusColor: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    sent: "bg-blue-100 text-blue-700",
    paid: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-500",
  };

  const sessionsWithTranscripts = client.sessions.filter(
    (s) => s.transcript
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/clients">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xl font-semibold">
            {client.firstName[0]}
            {client.lastName[0]}
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold">
              {client.firstName} {client.lastName}
            </h1>
            <p className="text-muted-foreground">{client.email}</p>
            {client.phone && (
              <p className="text-sm text-muted-foreground">{client.phone}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={tagColor[client.tags] ?? "bg-gray-100 text-gray-700"}>
            {client.tags}
          </Badge>
          <ClientActions client={client} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Link href={`/sessions/new?clientId=${client.id}`}>
          <Button variant="outline" size="sm">
            <CalendarDays className="mr-2 h-4 w-4" />
            Schedule Session
          </Button>
        </Link>
        <Link href={`/invoices/new?clientId=${client.id}`}>
          <Button variant="outline" size="sm">
            <Receipt className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </Link>
        <ClientRecapButton clientId={client.id} />
      </div>

      {/* Intake Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Intake Notes</CardTitle>
        </CardHeader>
        <CardContent>
          {client.intakeNotes ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {client.intakeNotes}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No intake notes yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions">
            <FileText className="mr-2 h-4 w-4" />
            Sessions ({client.sessions.length})
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <Receipt className="mr-2 h-4 w-4" />
            Invoices ({client.invoices.length})
          </TabsTrigger>
          <TabsTrigger value="transcripts">
            Transcripts ({sessionsWithTranscripts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="mt-4 space-y-2">
          {client.sessions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No sessions yet.</p>
                <Link href={`/sessions/new?clientId=${client.id}`}>
                  <Button variant="outline" className="mt-3" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule First Session
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            client.sessions.map((session) => (
              <Link key={session.id} href={`/sessions/${session.id}`}>
                <Card className="transition-colors hover:bg-accent/50">
                  <CardContent className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">
                        {format(new Date(session.date), "MMM d, yyyy · h:mm a")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.duration} min · {session.type}
                      </p>
                      {session.notes && (
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {session.notes.slice(0, 100)}...
                        </p>
                      )}
                    </div>
                    <Badge className={statusColor[session.status] ?? ""}>
                      {session.status}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="invoices" className="mt-4 space-y-2">
          {client.invoices.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No invoices yet.</p>
                <Link href={`/invoices/new?clientId=${client.id}`}>
                  <Button variant="outline" className="mt-3" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Invoice
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            client.invoices.map((invoice) => (
              <Link key={invoice.id} href={`/invoices/${invoice.id}`}>
                <Card className="transition-colors hover:bg-accent/50">
                  <CardContent className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        ${invoice.amount.toFixed(2)} · Due{" "}
                        {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge className={invoiceStatusColor[invoice.status] ?? ""}>
                      {invoice.status}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="transcripts" className="mt-4 space-y-2">
          {sessionsWithTranscripts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No transcripts available. Paste transcripts in session detail pages.
                </p>
              </CardContent>
            </Card>
          ) : (
            sessionsWithTranscripts.map((session) => (
              <Link key={session.id} href={`/sessions/${session.id}`}>
                <Card className="transition-colors hover:bg-accent/50">
                  <CardContent className="py-3">
                    <p className="font-medium">
                      {format(new Date(session.date), "MMM d, yyyy")}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {session.transcript?.slice(0, 200)}...
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
