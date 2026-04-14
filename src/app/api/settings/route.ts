import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  let settings = await prisma.settings.findUnique({
    where: { id: "default" },
  });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: "default" } });
  }
  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const settings = await prisma.settings.upsert({
    where: { id: "default" },
    update: body,
    create: { id: "default", ...body },
  });
  return NextResponse.json(settings);
}
