"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { product } from "@/orm/app/schema"
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
    .from(product)
    .where(and(eq(product.orgId, orgId), eq(product.unitId, unitId)))
  return result.count
}

export { getCount as getProductCount }
