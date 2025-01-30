"use server"

import { db } from "@/db/app/instance"
import { product } from "@/orm/app/schema"
import { ProductFormSchemaT } from "@/providers/product-form"
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
}) =>
  await db.insert(product).values({
    ...values,
    unitId,
    orgId,
  })

const update = async ({ values, id }: { values: FormSchemaT; id: string }) =>
  await db.update(product).set(values).where(eq(product.id, id))

export { create as createProduct, update as updateProduct }
