"use client"

import { Form } from "@/components/ui/form"
import { invoice, invoiceRow } from "@/orm/app/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const rowSchema = createInsertSchema(invoiceRow, {
  productId: (sch) => sch.productId.min(1),
  name: (sch) => sch.name.min(1),
  unitPrice: (sch) => sch.unitPrice.positive(),
  quantity: (sch) => sch.quantity.positive(),
}).omit({
  id: true,
  createdAt: true,
  invoiceId: true,
  total: true,
})

const schema = createInsertSchema(invoice, {})
  .omit({
    id: true,
    unitId: true,
    createdAt: true,
    total: true,
  })
  .extend({
    rows: z.array(rowSchema),
  })

type SchemaT = z.infer<typeof schema>

const defaultValues: SchemaT = {
  rows: [],
  customerId: "4d0572b6-e208-4352-8b17-0222788bee93", // TODO: implement customers
  customerName: "Demo", // TODO: implement customers
  discountType: "value",
  discountValue: 0,
  exchangeRate: 1,
  currency: "ALL",
  payMethod: "cash",
}

const Provider = (props: PropsWithChildren<{ defaultValues?: SchemaT }>) => {
  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...props.defaultValues },
  })

  return <Form {...form}>{props.children}</Form>
}

export { Provider as InvoiceFormProvider, type SchemaT as InvoiceFormSchemaT }
