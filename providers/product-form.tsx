"use client"

import { Form } from "@/components/ui/form"
import { product } from "@/orm/(inv)/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = createInsertSchema(product, {
  name: (sch) => sch.name.min(1),
}).omit({
  id: true,
  unitId: true,
  createdAt: true,
})

type SchemaT = z.infer<typeof schema>

const defaultValues: SchemaT = {
  name: "",
  barcode: "",
  price: 0,
  status: "active",
  description: "",
}

const ProductFormProvider = (
  props: PropsWithChildren<{ defaultValues?: SchemaT }>
) => {
  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...props.defaultValues },
  })

  return <Form {...form}>{props.children}</Form>
}

export { ProductFormProvider, type SchemaT as ProductFormSchemaT }
