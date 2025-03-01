"use client"

import { Form } from "@/components/ui/form"
import { product, productCategory, productInventory } from "@/orm/app/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const productSchema = createInsertSchema(product, {
  name: (sch) => sch.name.min(1),
  price: (sch) => sch.price.min(0),
}).omit({
  id: true,
  createdAt: true,
  orgId: true,
  unitId: true,
})

const inventorySchema = createInsertSchema(productInventory, {
  warehouseId: (sch) => sch.warehouseId.min(1),
}).omit({
  id: true,
  createdAt: true,
  orgId: true,
  unitId: true,
  productId: true,
})

const categorySchema = createInsertSchema(productCategory, {
  categoryId: (sch) => sch.categoryId.min(1),
}).omit({
  id: true,
  createdAt: true,
  orgId: true,
  unitId: true,
  productId: true,
})

const schema = productSchema.extend(
  z.object({
    inventoryRows: z.array(inventorySchema),
    categoryRows: z.array(categorySchema),
  }).shape
)

type SchemaT = z.infer<typeof schema>

const defaultValues: SchemaT = {
  name: "",
  status: "active",
  unit: "XPP",
  taxType: "0",
  price: 0,
  isFavorite: false,
  description: null,
  barcode: null,
  imageBucketPath: null,
  inventoryRows: [],
  categoryRows: [],
}

const Provider = (
  props: PropsWithChildren<{ defaultValues?: Partial<SchemaT> }>
) => {
  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...props.defaultValues },
  })

  return <Form {...form}>{props.children}</Form>
}

export { Provider as ProductFormProvider, type SchemaT as ProductFormSchemaT }
