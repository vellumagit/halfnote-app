import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id },
    include: { client: true },
  });
  if (!session)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(session);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.date !== undefined) data.date = new Date(body.date);
  if (body.duration !== undefined) data.duration = body.duration;
  if (body.type !== undefined) data.type = body.type;
  if (body.googleMeetLink !== undefined) data.googleMeetLink = body.googleMeetLink;
  if (body.status !== undefined) data.status = body.status;
  if (body.notes !== undefined) data.notes = body.notes;
  if (body.transcript !== undefined) data.transcript = body.transcript;
  if (body.summary !== undefined) data.summary = body.summary;
  if (body.followUpActions !== undefined) data.followUpActions = body.followUpActions;

  const session = await prisma.session.update({ where: { id }, data });
  return NextResponse.json(session);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.calendarEvent.deleteMany({ where: { sessionId: id } });
  await prisma.session.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
