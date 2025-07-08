"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { customer } from "@/orm/app/schema"
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
    .from(customer)
    .where(and(eq(customer.orgId, orgId), eq(customer.unitId, unitId)))
  return result.count
}

export { getCount as getCustomerCount }
