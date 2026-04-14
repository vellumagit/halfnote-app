import { Suspense } from "react";
import { NewInvoiceForm } from "@/components/invoices/new-invoice-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full max-w-2xl" />}>
      <NewInvoiceForm />
    </Suspense>
  );
}
