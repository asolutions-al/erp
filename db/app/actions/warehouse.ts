"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { warehouse } from "@/orm/app/schema"
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
  await db.update(warehouse).set(values).where(eq(warehouse.id, id))
}

export { create as createWarehouse, update as updateWarehouse }
