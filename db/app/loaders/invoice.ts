"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { invoice } from "@/orm/app/schema"
import { endOfMonth, startOfMonth } from "date-fns"
import { and, count, eq, gte, lte } from "drizzle-orm"

const getCount = async ({
  orgId,
  unitId,
}: {
  orgId: string
  unitId: string
}) => {
  const [result] = await db
    .select({ count: count() })
    .from(invoice)
    .where(
      and(
        eq(invoice.orgId, orgId),
        eq(invoice.unitId, unitId),
        gte(invoice.createdAt, startOfMonth(new Date()).toISOString()),
        lte(invoice.createdAt, endOfMonth(new Date()).toISOString())
      )
    )

  return result.count
}

export { getCount as getInvoiceMonthCount }
