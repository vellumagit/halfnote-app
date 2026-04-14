import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { format } from "date-fns";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const invoices = await prisma.invoice.findMany({
    where,
    include: { client: true },
    orderBy: { issuedDate: "desc" },
  });

  const outstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0);

  const statusColor: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    sent: "bg-blue-100 text-blue-700",
    paid: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Invoices</h1>
          <p className="mt-1 text-muted-foreground">
            {outstanding > 0
              ? `$${outstanding.toFixed(2)} outstanding`
              : "All invoices up to date"}
          </p>
        </div>
        <Link href="/invoices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      <div className="flex gap-2">
        {[
          { label: "All", value: "" },
          { label: "Draft", value: "draft" },
          { label: "Sent", value: "sent" },
          { label: "Paid", value: "paid" },
          { label: "Overdue", value: "overdue" },
        ].map((f) => (
          <Link key={f.value} href={`/invoices${f.value ? `?status=${f.value}` : ""}`}>
            <Button
              variant={status === f.value || (!status && !f.value) ? "default" : "outline"}
              size="sm"
            >
              {f.label}
            </Button>
          </Link>
        ))}
      </div>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No invoices found.</p>
            <Link href="/invoices/new">
              <Button variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <Link key={invoice.id} href={`/invoices/${invoice.id}`}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <Badge className={statusColor[invoice.status] ?? ""}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {invoice.client.firstName} {invoice.client.lastName} ·
                      Issued {format(new Date(invoice.issuedDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      ${invoice.amount.toFixed(2)}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        {invoice.currency}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
