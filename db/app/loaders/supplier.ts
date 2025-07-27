"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { supplier } from "@/orm/app/schema"
import { and, count, eq } from "drizzle-orm"

const getCount = async ({
  orgId,
  unitId,
}: {
  orgId: string
  unitId: string
}) => {
  const [result] = await db
    .select({ count: count() })
    .from(supplier)
    .where(and(eq(supplier.orgId, orgId), eq(supplier.unitId, unitId)))
  return result.count
}

export { getCount as getSupplierCount }
