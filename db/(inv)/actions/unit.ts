import { unit } from "@/orm/(inv)/schema"
import { UnitFormSchemaT } from "@/providers/unit-form"
import { db } from "../instance"

export const createUnit = async ({
  values,
  orgId,
}: {
  values: UnitFormSchemaT
  orgId: string
}) => {
  "use server"
  await db.insert(unit).values({
    ...values,
    orgId,
  })
}
