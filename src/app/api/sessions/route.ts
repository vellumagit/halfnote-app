import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const clientId = searchParams.get("clientId");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (clientId) where.clientId = clientId;

  const sessions = await prisma.session.findMany({
    where,
    include: { client: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(sessions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = await prisma.session.create({
    data: {
      clientId: body.clientId,
      date: new Date(body.date),
      duration: body.duration || 60,
      type: body.type || "google-meet",
      googleMeetLink: body.googleMeetLink || null,
      status: body.status || "scheduled",
      notes: body.notes || null,
    },
  });

  // Also create a calendar event
  if (session.status === "scheduled") {
    const endTime = new Date(
      new Date(session.date).getTime() + session.duration * 60000
    );
    const client = await prisma.client.findUnique({
      where: { id: session.clientId },
    });
    await prisma.calendarEvent.create({
      data: {
        clientId: session.clientId,
        sessionId: session.id,
        title: `Session — ${client?.firstName} ${client?.lastName}`,
        startTime: session.date,
        endTime,
        googleMeetLink: session.googleMeetLink,
        color: "#8B5CF6",
      },
    });
  }

  return NextResponse.json(session, { status: 201 });
}
