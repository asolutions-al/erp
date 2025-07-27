"use client"

import { Form } from "@/components/ui/form"
import { supplier } from "@/orm/app/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = createInsertSchema(supplier, {
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
  email: "",
  address: "",
  status: "active",
  city: "",
  description: "",
  idType: "id",
  idValue: "",
  imageBucketPath: "",
  isFavorite: false,
}

const Provider = (props: PropsWithChildren<{ defaultValues?: SchemaT }>) => {
  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...props.defaultValues },
  })

  return <Form {...form}>{props.children}</Form>
}

export { Provider as SupplierFormProvider, type SchemaT as SupplierFormSchemaT }
