"use server"

import { db } from "@/db/app/instance"
import { invoiceRow } from "@/orm/app/schema"
import { eq } from "drizzle-orm"

const get = ({ invoiceId }: { invoiceId: string }) =>
  db.query.invoiceRow.findMany({
    where: eq(invoiceRow.invoiceId, invoiceId),
  })

export { get as getInvoiceRows }
