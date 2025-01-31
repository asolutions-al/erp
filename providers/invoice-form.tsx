"use client"

import { Form } from "@/components/ui/form"
import { CustomerSchemaT } from "@/db/app/schema"
import { customer, invoice, invoiceRow, product } from "@/orm/app/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const rowSchema = createInsertSchema(invoiceRow, {
  productId: (sch) => sch.productId.min(1),
  name: (sch) => sch.name.min(1),
  unitPrice: (sch) => sch.unitPrice.min(0),
  quantity: (sch) => sch.quantity.positive(),
  product: createInsertSchema(product).required()
}).omit({
  id: true,
  createdAt: true,
  invoiceId: true,
  total: true,
  subtotal: true,
})

const schema = createInsertSchema(invoice, {
  customerId: (sch) => sch.customerId.min(1),
  customer: createInsertSchema(customer).required(),
})
  .omit({
    id: true,
    unitId: true,
    createdAt: true,
    total: true,
    orgId: true,
    subtotal: true,
    tax: true,
  })
  .extend({
    rows: z.array(rowSchema).min(1),
  })

type SchemaT = z.infer<typeof schema>

const defaultValues: SchemaT = {
  rows: [],
  customerId: "",
  customer: {} as CustomerSchemaT,
  discountType: "value",
  discountValue: 0,
  exchangeRate: 1,
  currency: "ALL",
  payMethod: "cash",
  status: "completed",
}

const Provider = (props: PropsWithChildren<{ defaultValues?: SchemaT }>) => {
  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...props.defaultValues },
  })

  return <Form {...form}>{props.children}</Form>
}

export { Provider as InvoiceFormProvider, type SchemaT as InvoiceFormSchemaT }
