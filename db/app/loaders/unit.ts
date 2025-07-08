"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { unit } from "@/orm/app/schema"
import { count, eq } from "drizzle-orm"

const getCount = async ({ orgId }: { orgId: string }) => {
  const [result] = await db
    .select({ count: count() })
    .from(unit)
    .where(eq(unit.orgId, orgId))
  return result.count
}

export { getCount as getUnitCount }
