import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { client: true, session: true },
  });
  if (!invoice)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(invoice);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.amount !== undefined) data.amount = parseFloat(body.amount);
  if (body.status !== undefined) {
    data.status = body.status;
    if (body.status === "paid") data.paidDate = new Date();
  }
  if (body.dueDate !== undefined) data.dueDate = new Date(body.dueDate);
  if (body.notes !== undefined) data.notes = body.notes;

  const invoice = await prisma.invoice.update({ where: { id }, data });
  return NextResponse.json(invoice);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.invoice.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
