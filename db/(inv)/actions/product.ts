import { product } from "@/orm/(inv)/schema"
import { ProductFormSchemaT } from "@/providers/product-form"
import { db } from "../instance"

export const createProduct = async ({
  values,
  unitId,
}: {
  values: ProductFormSchemaT
  unitId: string
}) => {
  "use server"
  const [res] = await db
    .insert(product)
    .values({
      ...values,
      unitId,
    })
    .returning({ id: product.id })

  return res
}
