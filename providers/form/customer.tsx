"use client"

import { Form } from "@/components/ui/form"
import { customer } from "@/orm/app/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = createInsertSchema(customer, {
  name: (sch) => sch.name.min(1),
}).omit({
  id: true,
  unitId: true,
  createdAt: true,
  orgId: true,
})

type SchemaT = z.infer<typeof schema>

const defaultValues: SchemaT = {
  name: "",
  email: null,
  address: null,
  status: "active",
  city: null,
  description: null,
  idType: "id",
  idValue: null,
  imageBucketPath: null,
  isFavorite: false,
}

const Provider = (props: PropsWithChildren<{ defaultValues?: SchemaT }>) => {
  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...props.defaultValues },
  })

  return <Form {...form}>{props.children}</Form>
}

export { Provider as CustomerFormProvider, type SchemaT as CustomerFormSchemaT }
