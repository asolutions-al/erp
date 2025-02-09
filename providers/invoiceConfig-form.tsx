"use client"

import { Form } from "@/components/ui/form"
import { invoiceConfig } from "@/orm/app/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = createInsertSchema(invoiceConfig).omit({
  id: true,
  orgId: true,
  unitId: true,
  createdAt: true,
})

type SchemaT = z.infer<typeof schema>

const defaultValues: SchemaT = {
  currency: "all",
  payMethod: "cash",
}

const Provider = (props: PropsWithChildren<{ defaultValues?: SchemaT }>) => {
  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...props.defaultValues },
  })

  return <Form {...form}>{props.children}</Form>
}

export {
  Provider as InvoiceConfigFormProvider,
  type SchemaT as InvoiceConfigFormSchemaT,
}
