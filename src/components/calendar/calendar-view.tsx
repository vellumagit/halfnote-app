"use client";

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string | null;
  clientName: string | null;
  sessionId: string | null;
  googleMeetLink: string | null;
}

export function CalendarView({
  events,
  year,
  month,
}: {
  events: CalendarEvent[];
  year: number;
  month: number;
}) {
  const router = useRouter();
  const currentDate = new Date(year, month - 1, 1);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  const getEventsForDay = (d: Date) =>
    events.filter((e) => isSameDay(new Date(e.startTime), d));

  return (
    <div>
      {/* Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <Link href={`/calendar?year=${prevYear}&month=${prevMonth}`}>
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="font-heading text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Link href={`/calendar?year=${nextYear}&month=${nextMonth}`}>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="border-r last:border-r-0 p-2 text-center text-xs font-semibold text-muted-foreground"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 border-b last:border-b-0">
              {week.map((d, di) => {
                const dayEvents = getEventsForDay(d);
                const inMonth = isSameMonth(d, currentDate);
                return (
                  <div
                    key={di}
                    className={cn(
                      "min-h-[100px] border-r last:border-r-0 p-1",
                      !inMonth && "bg-muted/30"
                    )}
                  >
                    <div
                      className={cn(
                        "mb-1 text-right text-xs",
                        isToday(d)
                          ? "font-bold text-purple-600"
                          : inMonth
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {isToday(d) ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white">
                          {format(d, "d")}
                        </span>
                      ) : (
                        format(d, "d")
                      )}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="cursor-pointer truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight text-white"
                          style={{
                            backgroundColor: event.color || "#8B5CF6",
                          }}
                          onClick={() => {
                            if (event.sessionId) {
                              router.push(`/sessions/${event.sessionId}`);
                            }
                          }}
                          title={`${event.title} — ${format(new Date(event.startTime), "h:mm a")}`}
                        >
                          {format(new Date(event.startTime), "h:mm")}{" "}
                          {event.title.replace("Session — ", "")}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <p className="text-[10px] text-muted-foreground px-1">
                          +{dayEvents.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
