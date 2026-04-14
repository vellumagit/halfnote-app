import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Clock,
  Video,
  ExternalLink,
} from "lucide-react";
import { SessionNotesEditor } from "@/components/sessions/session-notes-editor";
import { SessionTranscript } from "@/components/sessions/session-transcript";
import { SessionSummary } from "@/components/sessions/session-summary";
import { SessionStatusActions } from "@/components/sessions/session-status-actions";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id },
    include: { client: true },
  });

  if (!session) notFound();

  const statusColor: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-500",
    "no-show": "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/sessions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">
            Session with{" "}
            <Link
              href={`/clients/${session.clientId}`}
              className="text-purple-600 hover:underline"
            >
              {session.client.firstName} {session.client.lastName}
            </Link>
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {format(new Date(session.date), "EEEE, MMMM d, yyyy · h:mm a")}
            </span>
            <span>{session.duration} minutes</span>
            <span className="flex items-center gap-1">
              <Video className="h-4 w-4" />
              {session.type}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColor[session.status] ?? ""}>
            {session.status}
          </Badge>
          <SessionStatusActions
            sessionId={session.id}
            currentStatus={session.status}
          />
        </div>
      </div>

      {/* Google Meet Link */}
      {session.googleMeetLink && (
        <Card>
          <CardContent className="flex items-center justify-between py-3">
            <span className="text-sm text-muted-foreground">
              Google Meet Link
            </span>
            <a
              href={session.googleMeetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-purple-600 hover:underline"
            >
              {session.googleMeetLink}
              <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Session Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <SessionNotesEditor
            sessionId={session.id}
            initialNotes={session.notes ?? ""}
          />
        </CardContent>
      </Card>

      {/* Transcript */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          <SessionTranscript
            sessionId={session.id}
            initialTranscript={session.transcript ?? ""}
          />
        </CardContent>
      </Card>

      {/* AI Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">AI Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <SessionSummary
            sessionId={session.id}
            initialSummary={session.summary ?? ""}
            notes={session.notes ?? ""}
            transcript={session.transcript ?? ""}
          />
        </CardContent>
      </Card>

      {/* Follow-Up Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            Follow-Up Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SessionNotesEditor
            sessionId={session.id}
            initialNotes={session.followUpActions ?? ""}
            field="followUpActions"
            placeholder="Things to address next session, homework for client..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
