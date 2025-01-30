"use server"

import { db } from "@/db/app/instance"
import { invoiceRow } from "@/orm/app/schema"
import { eq } from "drizzle-orm"

const get = async ({ invoiceId }: { invoiceId: string }) => {
  const data = await db.query.invoiceRow.findMany({
    where: eq(invoiceRow.invoiceId, invoiceId),
  })
  return data
}

export { get as getInvoiceRows }
