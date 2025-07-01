"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { unit } from "@/orm/app/schema"
import { UnitFormSchemaT } from "@/providers"
import { and, eq } from "drizzle-orm"

type FormSchemaT = UnitFormSchemaT

const create = async ({
  values,
  orgId,
}: {
  values: FormSchemaT
  orgId: string
}) => {
  await db
    .insert(unit)
    .values({
      ...values,
      orgId,
    })
    .returning({
      id: unit.id,
    })
}

const update = async ({
  id,
  orgId,
  values,
}: {
  id: string
  orgId: string
  values: FormSchemaT
}) => {
  await db
    .update(unit)
    .set(values)
    .where(and(eq(unit.id, id), eq(unit.orgId, orgId)))
}

export { create as createUnit, update as updateUnit }
