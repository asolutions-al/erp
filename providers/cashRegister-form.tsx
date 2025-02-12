"use client"

import { Form } from "@/components/ui/form"
import { cashRegister } from "@/orm/app/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = createInsertSchema(cashRegister, {
  name: (sch) => sch.name.min(1),
}).omit({
  id: true,
  orgId: true,
  unitId: true,
  createdAt: true,
  openedAt: true,
  closedAt: true,
  openedBy: true,
  closedBy: true,
  balance: true,
  closingBalanace: true,
  isOpen: true,
})

type SchemaT = z.infer<typeof schema>

const defaultValues: SchemaT = {
  name: "",
  status: "active",
  openingBalance: 0,
  isFavorite: false,
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

export {
  Provider as CashRegisterFormProvider,
  type SchemaT as CashRegisterFormSchemaT,
}
