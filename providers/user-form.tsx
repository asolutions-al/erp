"use client"

import { Form } from "@/components/ui/form"
import { user } from "@/orm/app/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = createInsertSchema(user, {}).omit({
  id: true,
  createdAt: true,
  email: true,
})

type SchemaT = z.infer<typeof schema>

const defaultValues: SchemaT = {
  displayName: "",
}

const Provider = (props: PropsWithChildren<{ defaultValues?: SchemaT }>) => {
  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...props.defaultValues },
  })

  return <Form {...form}>{props.children}</Form>
}

export { Provider as UserFormProvider, type SchemaT as UserFormSchemaT }
