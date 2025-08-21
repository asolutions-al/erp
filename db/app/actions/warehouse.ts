"use server"
import "server-only"

import { db } from "@/db/app/instance"
import {
  invoiceConfig,
  product,
  productInventory,
  warehouse,
} from "@/orm/app/schema"
import { WarehouseFormSchemaT } from "@/providers"
import { and, eq } from "drizzle-orm"

type FormSchemaT = WarehouseFormSchemaT

const create = async ({
  values,
  unitId,
  orgId,
}: {
  values: FormSchemaT
  unitId: string
  orgId: string
}) => {
  await db.insert(warehouse).values({
    ...values,
    orgId,
    unitId,
  })
}

const update = async ({ values, id }: { values: FormSchemaT; id: string }) => {
  await db.transaction(async (tx) => {
    await tx.update(warehouse).set(values).where(eq(warehouse.id, id))

    if (values.status !== "active")
      await tx
        .update(invoiceConfig)
        .set({
          warehouseId: null,
        })
        .where(eq(invoiceConfig.warehouseId, id))
  })
}

const markAsFavorite = async ({
  id,
  isFavorite,
}: {
  id: string
  isFavorite: boolean
}) => {
  await db.update(warehouse).set({ isFavorite }).where(eq(warehouse.id, id))
}

const getWarehouseProducts = async ({
  warehouseId,
  unitId,
}: {
  warehouseId: string
  unitId: string
}) => {
  const products = await db.query.product.findMany({
    where: and(eq(product.unitId, unitId), eq(product.status, "active")),
    orderBy: product.createdAt,
    with: {
      productInventories: {
        where: eq(productInventory.warehouseId, warehouseId),
        with: {
          warehouse: true,
        },
      },
      productCategories: {
        with: {
          category: true,
        },
      },
    },
  })

  // Filter products that have inventory in this warehouse
  return products.filter((product) => product.productInventories.length > 0)
}

export {
  create as createWarehouse,
  getWarehouseProducts,
  markAsFavorite as markWarehouseAsFavorite,
  update as updateWarehouse,
}
