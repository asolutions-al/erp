"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { product } from "@/orm/app/schema"
import { and, count, eq, inArray } from "drizzle-orm"

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

const checkDuplicates = async ({
  orgId,
  unitId,
  productNames,
}: {
  orgId: string
  unitId: string
  productNames: string[]
}) => {
  if (productNames.length === 0) return []

  const existingProducts = await db.query.product.findMany({
    where: and(
      eq(product.orgId, orgId),
      eq(product.unitId, unitId),
      inArray(product.name, productNames)
    ),
    columns: {
      name: true,
      barcode: true,
    },
  })

  return existingProducts
}

export {
  checkDuplicates as checkProductDuplicates,
  getCount as getProductCount,
}
