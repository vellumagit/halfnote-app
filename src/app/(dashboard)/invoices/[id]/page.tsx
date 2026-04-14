import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Printer } from "lucide-react";
import { InvoiceStatusActions } from "@/components/invoices/invoice-status-actions";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { client: true, session: true },
  });

  if (!invoice) notFound();

  const settings = await prisma.settings.findUnique({
    where: { id: "default" },
  });

  const statusColor: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    sent: "bg-blue-100 text-blue-700",
    paid: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/invoices">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">
            {invoice.invoiceNumber}
          </h1>
          <p className="text-muted-foreground">
            For{" "}
            <Link
              href={`/clients/${invoice.clientId}`}
              className="text-purple-600 hover:underline"
            >
              {invoice.client.firstName} {invoice.client.lastName}
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColor[invoice.status] ?? ""}>
            {invoice.status}
          </Badge>
          <InvoiceStatusActions
            invoiceId={invoice.id}
            currentStatus={invoice.status}
          />
          <Link href={`/invoices/${invoice.id}/print`}>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="py-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-3xl font-bold">
                  ${invoice.amount.toFixed(2)}{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    {invoice.currency}
                  </span>
                </p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Issued Date</p>
                  <p className="font-medium">
                    {format(new Date(invoice.issuedDate), "MMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p className="font-medium">
                    {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                  </p>
                </div>
                {invoice.paidDate && (
                  <div>
                    <p className="text-muted-foreground">Paid Date</p>
                    <p className="font-medium">
                      {format(new Date(invoice.paidDate), "MMM d, yyyy")}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">
                  {invoice.client.firstName} {invoice.client.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {invoice.client.email}
                </p>
              </div>
              {invoice.session && (
                <div>
                  <p className="text-sm text-muted-foreground">Related Session</p>
                  <Link
                    href={`/sessions/${invoice.session.id}`}
                    className="text-sm text-purple-600 hover:underline"
                  >
                    {format(new Date(invoice.session.date), "MMM d, yyyy")} —{" "}
                    {invoice.session.duration} min
                  </Link>
                </div>
              )}
              {invoice.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{invoice.notes}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
