import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, DollarSign, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format, startOfDay, endOfDay, addDays, startOfMonth, endOfMonth } from "date-fns";

export default async function DashboardPage() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekEnd = endOfDay(addDays(now, 7));
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [
    activeClients,
    sessionsThisMonth,
    revenueThisMonth,
    outstandingInvoices,
    todaySessions,
    upcomingSessions,
    recentClients,
    recentSessions,
  ] = await Promise.all([
    prisma.client.count({ where: { tags: { contains: "active" } } }),
    prisma.session.count({
      where: { date: { gte: monthStart, lte: monthEnd } },
    }),
    prisma.invoice.aggregate({
      where: {
        status: "paid",
        paidDate: { gte: monthStart, lte: monthEnd },
      },
      _sum: { amount: true },
    }),
    prisma.invoice.findMany({
      where: { status: { in: ["sent", "overdue"] } },
    }),
    prisma.session.findMany({
      where: { date: { gte: todayStart, lte: todayEnd } },
      include: { client: true },
      orderBy: { date: "asc" },
    }),
    prisma.session.findMany({
      where: { date: { gt: todayEnd, lte: weekEnd }, status: "scheduled" },
      include: { client: true },
      orderBy: { date: "asc" },
      take: 10,
    }),
    prisma.client.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.session.findMany({
      where: { status: "completed" },
      include: { client: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  const outstandingTotal = outstandingInvoices.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );

  const statusColor: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-500",
    "no-show": "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back. Here is what is happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sessions This Month
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionsThisMonth}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue This Month
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(revenueThisMonth._sum.amount ?? 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outstanding
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {outstandingInvoices.length} (${outstandingTotal.toFixed(2)})
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              Today&apos;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaySessions.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No sessions scheduled for today.
              </p>
            ) : (
              <div className="space-y-3">
                {todaySessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/sessions/${session.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                  >
                    <div>
                      <p className="font-medium">
                        {session.client.firstName} {session.client.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(session.date), "h:mm a")} ·{" "}
                        {session.duration} min · {session.type}
                      </p>
                    </div>
                    <Badge className={statusColor[session.status] ?? ""}>
                      {session.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming This Week */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              Upcoming This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No upcoming sessions this week.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/sessions/${session.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                  >
                    <div>
                      <p className="font-medium">
                        {session.client.firstName} {session.client.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(session.date), "EEE, MMM d · h:mm a")}
                      </p>
                    </div>
                    <Badge className={statusColor[session.status] ?? ""}>
                      {session.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-3 text-sm"
              >
                <div className="h-2 w-2 rounded-full bg-purple-400" />
                <span className="text-muted-foreground">
                  Session completed with{" "}
                  <Link
                    href={`/clients/${session.clientId}`}
                    className="font-medium text-foreground hover:text-purple-600"
                  >
                    {session.client.firstName} {session.client.lastName}
                  </Link>{" "}
                  — {format(new Date(session.date), "MMM d, yyyy")}
                </span>
              </div>
            ))}
            {recentClients.slice(0, 3).map((client) => (
              <div key={client.id} className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-gold-500" />
                <span className="text-muted-foreground">
                  Client{" "}
                  <Link
                    href={`/clients/${client.id}`}
                    className="font-medium text-foreground hover:text-purple-600"
                  >
                    {client.firstName} {client.lastName}
                  </Link>{" "}
                  added — {format(new Date(client.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
