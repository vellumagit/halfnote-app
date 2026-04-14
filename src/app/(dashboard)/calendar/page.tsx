import { prisma } from "@/lib/prisma";
import { CalendarView } from "@/components/calendar/calendar-view";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
} from "date-fns";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const sp = await searchParams;
  const now = new Date();
  const year = sp.year ? parseInt(sp.year) : now.getFullYear();
  const month = sp.month ? parseInt(sp.month) : now.getMonth() + 1;

  const currentDate = new Date(year, month - 1, 1);
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);

  const events = await prisma.calendarEvent.findMany({
    where: {
      startTime: { gte: start, lte: end },
    },
    include: { client: true },
    orderBy: { startTime: "asc" },
  });

  const serializedEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    startTime: e.startTime.toISOString(),
    endTime: e.endTime.toISOString(),
    color: e.color,
    clientName: e.client
      ? `${e.client.firstName} ${e.client.lastName}`
      : null,
    sessionId: e.sessionId,
    googleMeetLink: e.googleMeetLink,
  }));

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-semibold">Calendar</h1>
      <CalendarView
        events={serializedEvents}
        year={year}
        month={month}
      />
    </div>
  );
}
