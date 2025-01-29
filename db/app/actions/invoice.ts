import { db } from "@/db/app/instance"
import { invoice, invoiceRow } from "@/orm/app/schema"
import { InvoiceFormSchemaT } from "@/providers/invoice-form"
import { calcInvoiceForm, calcInvoiceFormRow } from "@/utils/calc"

type FormSchemaT = InvoiceFormSchemaT

const create = async ({
  values,
  unitId,
  orgId,
}: {
  values: FormSchemaT
  unitId: string
  orgId: string
}) => {
  "use server"
  await db.transaction(async (tx) => {
    const [res] = await tx
      .insert(invoice)
      .values({
        ...values,
        unitId,
        orgId,
        tax: calcInvoiceForm(values).tax,
        subtotal: calcInvoiceForm(values).subtotal,
        total: calcInvoiceForm(values).total,
      })
      .returning({
        id: invoice.id,
      })

    await tx.insert(invoiceRow).values(
      values.rows.map((row) => ({
        ...row,
        invoiceId: res.id,
        subtotal: calcInvoiceFormRow(row).subtotal,
        total: calcInvoiceFormRow(row).total,
      }))
    )
  })
}

export { create as createInvoice }
