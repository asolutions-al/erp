"use server"
import "server-only"

import { db } from "@/db/app/instance"
import {
  cashRegister,
  invoice,
  invoiceConfig,
  invoiceRow,
} from "@/orm/app/schema"
import { InvoiceFormSchemaT } from "@/providers/invoice-form"
import { calcInvoiceForm, calcInvoiceFormRow } from "@/utils/calc"
import { checkShouldTriggerCash } from "@/utils/checks"
import { eq, sql } from "drizzle-orm"

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
  const calcs = calcInvoiceForm(values)

  await db.transaction(async (tx) => {
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

  const backgroundTasks = async () => {
    const config = await db.query.invoiceConfig.findFirst({
      where: eq(invoiceConfig.unitId, unitId),
    })
    if (!config) return

    const shouldTriggerCash = checkShouldTriggerCash({
      invoiceConfig: config,
      payMethod: values.payMethod,
    })

    if (shouldTriggerCash) {
      await db
        .update(cashRegister)
        .set({
          balance: sql`${cashRegister.balance} + ${calcs.total}`,
        })
        .where(eq(cashRegister.id, values.cashRegisterId!))
    }
  }

  backgroundTasks()
}

export { create as createInvoice }
