"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { invoiceConfig } from "@/orm/app/schema"
import { InvoiceConfigFormSchemaT } from "@/providers/invoice-config-form"
import { eq } from "drizzle-orm"

type FormSchemaT = InvoiceConfigFormSchemaT

const update = async ({ values, id }: { values: FormSchemaT; id: string }) => {
  await db.update(invoiceConfig).set(values).where(eq(invoiceConfig.id, id))
}

export { update as updateInvoiceConfig }
