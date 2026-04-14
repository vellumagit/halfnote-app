import { prisma } from "@/lib/prisma";
import { generateInvoiceNumber } from "@/lib/invoice-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");
  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const invoices = await prisma.invoice.findMany({
    where,
    include: { client: true, session: true },
    orderBy: { issuedDate: "desc" },
  });
  return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const invoiceNumber = await generateInvoiceNumber();
  const invoice = await prisma.invoice.create({
    data: {
      clientId: body.clientId,
      sessionId: body.sessionId || null,
      amount: parseFloat(body.amount),
      currency: body.currency || "CAD",
      status: body.status || "draft",
      issuedDate: body.issuedDate ? new Date(body.issuedDate) : new Date(),
      dueDate: body.dueDate
        ? new Date(body.dueDate)
        : new Date(Date.now() + 14 * 86400000),
      notes: body.notes || null,
      invoiceNumber,
    },
  });
  return NextResponse.json(invoice, { status: 201 });
}
