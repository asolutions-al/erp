import { createAuthClient } from "@/db/(auth)/client"
import { member, unit } from "@/orm/(inv)/schema"
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

  const client = await createAuthClient()
  const {
    data: { user },
  } = await client.auth.getUser()

  await db.transaction(async (trx) => {
    const [unitRes] = await trx
      .insert(unit)
      .values({
        ...values,
        orgId,
      })
      .returning({
        id: unit.id,
      })

    await trx.insert(member).values({
      userId: user!.id,
      unitId: unitRes.id,
      role: "owner",
    })
  })
}
