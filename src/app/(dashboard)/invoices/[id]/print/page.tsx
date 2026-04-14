import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default async function PrintInvoicePage({
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

  return (
    <div className="mx-auto max-w-2xl bg-white p-8 print:p-0 print:max-w-none">
      {/* Print button - hidden when printing */}
      <div className="mb-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          Print Invoice
        </button>
      </div>

      {/* Invoice Header */}
      <div className="flex justify-between border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {settings?.businessName || "Halfnote Healing"}
          </h1>
          {settings?.practitionerName && (
            <p className="text-gray-600">{settings.practitionerName}</p>
          )}
          {settings?.email && (
            <p className="text-sm text-gray-500">{settings.email}</p>
          )}
          {settings?.phone && (
            <p className="text-sm text-gray-500">{settings.phone}</p>
          )}
          {settings?.address && (
            <p className="text-sm text-gray-500">{settings.address}</p>
          )}
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-gray-400">INVOICE</h2>
          <p className="mt-2 text-lg font-semibold">{invoice.invoiceNumber}</p>
        </div>
      </div>

      {/* Bill To & Dates */}
      <div className="mt-6 grid grid-cols-2 gap-8">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase">Bill To</p>
          <p className="mt-1 font-medium">
            {invoice.client.firstName} {invoice.client.lastName}
          </p>
          <p className="text-sm text-gray-600">{invoice.client.email}</p>
          {invoice.client.phone && (
            <p className="text-sm text-gray-600">{invoice.client.phone}</p>
          )}
        </div>
        <div className="text-right">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Invoice Date:</span>
              <span>{format(new Date(invoice.issuedDate), "MMM d, yyyy")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Due Date:</span>
              <span>{format(new Date(invoice.dueDate), "MMM d, yyyy")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="font-medium capitalize">{invoice.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-2 text-left text-sm font-semibold text-gray-500">
                Description
              </th>
              <th className="py-2 text-right text-sm font-semibold text-gray-500">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3">
                <p className="font-medium">Healing Session</p>
                {invoice.session && (
                  <p className="text-sm text-gray-500">
                    {format(new Date(invoice.session.date), "MMM d, yyyy")} —{" "}
                    {invoice.session.duration} minutes ({invoice.session.type})
                  </p>
                )}
                {invoice.notes && (
                  <p className="text-sm text-gray-500">{invoice.notes}</p>
                )}
              </td>
              <td className="py-3 text-right font-medium">
                ${invoice.amount.toFixed(2)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300">
              <td className="py-3 text-right font-semibold">Total</td>
              <td className="py-3 text-right text-xl font-bold">
                ${invoice.amount.toFixed(2)} {invoice.currency}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payment Info */}
      {settings?.paymentTerms && (
        <div className="mt-8 rounded-lg bg-gray-50 p-4 print:bg-white print:border">
          <p className="text-sm font-semibold text-gray-500">Payment Terms</p>
          <p className="mt-1 text-sm">{settings.paymentTerms}</p>
          {settings.paymentDetails && (
            <p className="mt-2 text-sm">{settings.paymentDetails}</p>
          )}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-400">
        Thank you for your trust.
      </div>
    </div>
  );
}
