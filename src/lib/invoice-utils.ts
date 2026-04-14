import { prisma } from "./prisma";

export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.invoice.count({
    where: {
      invoiceNumber: {
        startsWith: `INV-${year}`,
      },
    },
  });
  return `INV-${year}-${String(count + 1).padStart(3, "0")}`;
}
