"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { customer, invoiceConfig } from "@/orm/app/schema"
import { CustomerFormSchemaT } from "@/providers"
import { eq } from "drizzle-orm"

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

export {
  create as createCustomer,
  markAsFavorite as markCustomerAsFavorite,
  update as updateCustomer,
}
