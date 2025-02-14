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
  price: (sch) => sch.price.min(0),
  quantity: (sch) => sch.quantity.positive(),
}).omit({
  id: true,
  createdAt: true,
  orgId: true,
  unitId: true,
  invoiceId: true,
  total: true,
  subtotal: true,
  tax: true,
})

const schema = createInsertSchema(invoice, {
  customerId: (sch) => sch.customerId.min(1),
  discountValue: (sch) => sch.discountValue.min(0),
})
  .omit({
    id: true,
    unitId: true,
    orgId: true,
    createdAt: true,
    total: true,
    subtotal: true,
    tax: true,
  })
  .extend({
    rows: z.array(rowSchema).min(1),
  })
  .refine(
    (data) => {
      if (data.payMethod === "cash") return !!data.cashRegisterId
      return true
    },
    {
      path: ["cashRegisterId"],
      message: "Cash register is required",
    }
  )

type SchemaT = z.infer<typeof schema>

const defaultValues: SchemaT = {
  rows: [],
  customerId: "",
  customerName: "",
  customerIdType: "id",
  customerIdValue: "",
  discountType: "value",
  discountValue: 0,
  payMethod: "cash",
  status: "completed",
  cashRegisterId: null,
  notes: "",
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

export { Provider as InvoiceFormProvider, type SchemaT as InvoiceFormSchemaT }
