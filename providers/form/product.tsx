"use client"

import { Form } from "@/components/ui/form"
import { product, productCategory, productInventory } from "@/orm/app/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { useTranslations } from "next-intl"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const createSchema = ({ t }: { t: ReturnType<typeof useTranslations> }) => {
  const productSchema = createInsertSchema(product, {
    name: (sch) => sch.name.min(1),
    price: (sch) => sch.price.min(0),
    taxPercentage: (sch) => sch.taxPercentage.min(0).max(100),
  }).omit({
    id: true,
    createdAt: true,
    orgId: true,
    unitId: true,
  })

  const inventorySchema = createInsertSchema(productInventory, {
    warehouseId: (sch) => sch.warehouseId.min(1),
  })
    .omit({
      id: true,
      createdAt: true,
      orgId: true,
      unitId: true,
      productId: true,
    })
    .refine(
      (value) => {
        // prevent stock overflow
        return value.minStock <= value.stock && value.stock <= value.maxStock
      },
      {
        message: t("Stock should be between min stock and max stock"),
        path: ["stock"],
      }
    )

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

  return schema
}

type SchemaT = z.infer<ReturnType<typeof createSchema>>

const defaultValues: SchemaT = {
  name: "",
  status: "active",
  unit: "XPP",
  price: 0,
  isFavorite: false,
  description: null,
  barcode: null,
  imageBucketPath: null,
  inventoryRows: [],
  categoryRows: [],
  taxPercentage: 0,
}

const Provider = (
  props: PropsWithChildren<{ defaultValues?: Partial<SchemaT> }>
) => {
  const t = useTranslations()

  const schema = createSchema({ t })

  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...props.defaultValues },
  })

  return <Form {...form}>{props.children}</Form>
}

export { Provider as ProductFormProvider, type SchemaT as ProductFormSchemaT }
