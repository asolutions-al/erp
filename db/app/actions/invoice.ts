"use server"
import "server-only"

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
  await db.transaction(async (tx) => {
    const calcs = calcInvoiceForm(values)
    const [res] = await tx
      .insert(invoice)
      .values({
        ...values,
        unitId,
        orgId,
        tax: calcs.tax,
        total: calcs.total,
        subtotal: calcs.subtotal,
      })
      .returning({
        id: invoice.id,
      })

    await tx.insert(invoiceRow).values(
      values.rows.map((row) => {
        const calcs = calcInvoiceFormRow(row)
        return {
          ...row,
          unitId,
          orgId,
          invoiceId: res.id,
          tax: calcs.tax,
          total: calcs.total,
          subtotal: calcs.subtotal,
        }
      })
    )
  })
}

export { create as createInvoice }
