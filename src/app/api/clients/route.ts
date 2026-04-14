import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") ?? "";
  const tag = searchParams.get("tag") ?? "";

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

  const result = clients.map((c) => ({
    ...c,
    lastSessionDate: c.sessions[0]?.date ?? null,
    totalSessions: c._count.sessions,
    outstandingBalance: c.invoices.reduce((s, i) => s + i.amount, 0),
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const client = await prisma.client.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || null,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
      intakeNotes: body.intakeNotes || null,
      tags: body.tags || "new",
    },
  });
  return NextResponse.json(client, { status: 201 });
}
