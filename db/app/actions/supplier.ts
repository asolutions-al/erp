"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { invoiceConfig, supplier } from "@/orm/app/schema"
import { SupplierFormSchemaT } from "@/providers"
import { eq } from "drizzle-orm"

type FormSchemaT = SupplierFormSchemaT

const create = async ({
  values,
  unitId,
  orgId,
}: {
  values: FormSchemaT
  unitId: string
  orgId: string
}) => {
  await db.insert(supplier).values({
    ...values,
    unitId,
    orgId,
  })
}

const update = async ({ values, id }: { values: FormSchemaT; id: string }) => {
  await db.transaction(async (tx) => {
    await tx.update(supplier).set(values).where(eq(supplier.id, id))

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
  await db.update(supplier).set({ isFavorite }).where(eq(supplier.id, id))
}

export {
  create as createSupplier,
  markAsFavorite as markSupplierAsFavorite,
  update as updateSupplier,
}
