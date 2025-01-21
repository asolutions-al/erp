import { db } from "@/db/app/instance"
import { invoice, invoiceRow } from "@/orm/app/schema"
import { InvoiceFormSchemaT } from "@/providers/invoice-form"

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
        total: values.rows.reduce(
          (acc, row) => acc + row.quantity * row.unitPrice,
          0
        ),
        ...values,
      })
      .returning({
        id: invoice.id,
      })

    await tx.insert(invoiceRow).values(
      values.rows.map((row) => ({
        ...row,
        invoiceId: res.id,
        total: row.quantity * row.unitPrice,
      }))
    )
  })
}
