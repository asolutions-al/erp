"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { customer, invoice, invoiceConfig } from "@/orm/app/schema"
import { CustomerFormSchemaT } from "@/providers"
import { and, desc, eq } from "drizzle-orm"

type FormSchemaT = CustomerFormSchemaT

const create = async ({
  values,
  unitId,
  orgId,
}: {
  values: FormSchemaT
  unitId: string
  orgId: string
}) => {
  await db.insert(customer).values({
    ...values,
    unitId,
    orgId,
  })
}

const update = async ({ values, id }: { values: FormSchemaT; id: string }) => {
  await db.transaction(async (tx) => {
    await tx.update(customer).set(values).where(eq(customer.id, id))

    if (values.status !== "active")
      await tx
        .update(invoiceConfig)
        .set({
          customerId: null,
        })
        .where(eq(invoiceConfig.customerId, id))
  })
}

const markAsFavorite = async ({
  id,
  isFavorite,
}: {
  id: string
  isFavorite: boolean
}) => {
  await db.update(customer).set({ isFavorite }).where(eq(customer.id, id))
}

const getCustomerInvoices = async ({
  customerId,
  unitId,
  orgId,
}: {
  customerId: string
  unitId: string
  orgId: string
}) => {
  const invoices = await db.query.invoice.findMany({
    where: and(
      eq(invoice.customerId, customerId),
      eq(invoice.unitId, unitId),
      eq(invoice.orgId, orgId)
    ),
    orderBy: desc(invoice.createdAt),
    with: {
      customer: true,
      warehouse: true,
      cashRegister: true,
      user_createdBy: true,
    },
  })

  return invoices
}

export {
  create as createCustomer,
  getCustomerInvoices,
  markAsFavorite as markCustomerAsFavorite,
  update as updateCustomer,
}
