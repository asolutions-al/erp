"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { unit } from "@/orm/app/schema"
import { UnitFormSchemaT } from "@/providers"

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

export { create as createUnit }
