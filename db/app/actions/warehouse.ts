"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { invoiceConfig, warehouse } from "@/orm/app/schema"
import { WarehouseFormSchemaT } from "@/providers"
import { eq } from "drizzle-orm"

type FormSchemaT = WarehouseFormSchemaT

const create = async ({
  values,
  unitId,
  orgId,
}: {
  values: FormSchemaT
  unitId: string
  orgId: string
}) => {
  await db.insert(warehouse).values({
    ...values,
    orgId,
    unitId,
  })
}

const update = async ({ values, id }: { values: FormSchemaT; id: string }) => {
  await db.transaction(async (tx) => {
    await tx.update(warehouse).set(values).where(eq(warehouse.id, id))

    if (values.status !== "active")
      await tx
        .update(invoiceConfig)
        .set({
          warehouseId: null,
        })
        .where(eq(invoiceConfig.warehouseId, id))
  })
}

export { create as createWarehouse, update as updateWarehouse }
