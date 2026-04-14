import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");
  const year = request.nextUrl.searchParams.get("year");

  const where: Record<string, unknown> = {};
  if (month && year) {
    const start = new Date(parseInt(year), parseInt(month) - 1, 1);
    const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
    where.startTime = { gte: start, lte: end };
  }

  const events = await prisma.calendarEvent.findMany({
    where,
    include: { client: true },
    orderBy: { startTime: "asc" },
  });
  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const event = await prisma.calendarEvent.create({
    data: {
      clientId: body.clientId || null,
      sessionId: body.sessionId || null,
      title: body.title,
      description: body.description || null,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      googleMeetLink: body.googleMeetLink || null,
      color: body.color || null,
    },
  });
  return NextResponse.json(event, { status: 201 });
}
