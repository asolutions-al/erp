"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { product } from "@/orm/app/schema"
import { ProductFormSchemaT } from "@/providers/product-form"
import { eq } from "drizzle-orm"

type FormSchemaT = ProductFormSchemaT

const create = ({
  values,
  unitId,
  orgId,
}: {
  values: FormSchemaT
  unitId: string
  orgId: string
}) =>
  db.insert(product).values({
    ...values,
    unitId,
    orgId,
  })

const update = ({ values, id }: { values: FormSchemaT; id: string }) =>
  db.update(product).set(values).where(eq(product.id, id))

const markAsFavorite = async ({
  id,
  isFavorite,
}: {
  id: string
  isFavorite: boolean
}) => db.update(product).set({ isFavorite }).where(eq(product.id, id))

export {
  create as createProduct,
  markAsFavorite as markProductAsFavorite,
  update as updateProduct,
}
