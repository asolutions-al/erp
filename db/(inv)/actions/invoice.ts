import { invoice, invoiceRow } from "@/orm/(inv)/schema"
import { InvoiceFormSchemaT } from "@/providers/invoice-form"
import { db } from "../instance"

export const createInvoice = async ({
  values,
  unitId,
}: {
  values: InvoiceFormSchemaT
  unitId: string
}) => {
  "use server"
  await db.transaction(async (tx) => {
    const [res] = await tx
      .insert(invoice)
      .values({
        unitId,
      })
      .returning({
        id: invoice.id,
      })

    for (const row of values.rows) {
      await tx.insert(invoiceRow).values({
        ...row,
        invoiceId: res.id,
      })
    }
  })
}
