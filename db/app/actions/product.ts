import { db } from "@/db/app/instance"
import { product } from "@/orm/app/schema"
import { ProductFormSchemaT } from "@/providers/product-form"
import { eq } from "drizzle-orm"

export const createProduct = async ({
  values,
  unitId,
}: {
  values: ProductFormSchemaT
  unitId: string
}) => {
  "use server"
  await db.insert(product).values({
    ...values,
    unitId,
  })
}

export const updateProduct = async ({
  values,
  id,
}: {
  values: ProductFormSchemaT
  id: string
}) => {
  "use server"
  await db.update(product).set(values).where(eq(product.id, id))
}
