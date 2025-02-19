"use client"

import { Form } from "@/components/ui/form"
import { category } from "@/orm/app/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = createInsertSchema(category, {
  name: (sch) => sch.name.min(1),
}).omit({
  id: true,
  createdAt: true,
  orgId: true,
  unitId: true,
})

type SchemaT = z.infer<typeof schema>

const defaultValues: SchemaT = {
  name: "",
  status: "active",
  isFavorite: false,
  forCustomer: true,
  forProduct: true,
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

export { Provider as CategoryFormProvider, type SchemaT as CategoryFormSchemaT }
