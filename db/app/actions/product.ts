"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { product, productCategory, productInventory } from "@/orm/app/schema"
import { ProductFormSchemaT } from "@/providers"
import { eq } from "drizzle-orm"

type FormSchemaT = ProductFormSchemaT

const create = async ({
  values,
  unitId,
  orgId,
}: {
  values: FormSchemaT
  unitId: string
  orgId: string
}) => {
  await db.transaction(async (tx) => {
    const [res] = await tx
      .insert(product)
      .values({
        ...values,
        unitId,
        orgId,
      })
      .returning({
        id: product.id,
      })

    const { inventoryRows, categoryRows } = values

    if (inventoryRows.length > 0)
      await tx.insert(productInventory).values(
        inventoryRows.map((row) => {
          return {
            ...row,
            unitId,
            orgId,
            productId: res.id,
          }
        })
      )

    if (categoryRows.length > 0)
      await tx.insert(productCategory).values(
        categoryRows.map((row) => {
          return {
            ...row,
            unitId,
            orgId,
            productId: res.id,
          }
        })
      )
  })
}

const update = async ({
  values,
  id,
  orgId,
  unitId,
}: {
  values: FormSchemaT
  id: string
  orgId: string
  unitId: string
}) => {
  await db.transaction(async (tx) => {
    await tx.update(product).set(values).where(eq(product.id, id))

    await tx.delete(productInventory).where(eq(productInventory.productId, id))
    await tx.delete(productCategory).where(eq(productCategory.productId, id))

    const { inventoryRows, categoryRows } = values

    if (inventoryRows.length > 0)
      await tx.insert(productInventory).values(
        inventoryRows.map((row) => {
          return {
            ...row,
            productId: id,
            orgId,
            unitId,
          }
        })
      )

    if (categoryRows.length > 0)
      await tx.insert(productCategory).values(
        categoryRows.map((row) => {
          return {
            ...row,
            productId: id,
            orgId,
            unitId,
          }
        })
      )
  })
}

const markAsFavorite = async ({
  id,
  isFavorite,
}: {
  id: string
  isFavorite: boolean
}) => {
  await db.update(product).set({ isFavorite }).where(eq(product.id, id))
}

export {
  create as createProduct,
  markAsFavorite as markProductAsFavorite,
  update as updateProduct,
}
