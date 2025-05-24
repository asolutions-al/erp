"use client"

import { Form } from "@/components/ui/form"
import { InvoiceConfigSchemaT, ProductInventorySchemaT } from "@/db/app/schema"
import { invoice, invoiceRow } from "@/orm/app/schema"
import { taxTypeToPercentage } from "@/utils/calc"
import { checkShouldTriggerCash } from "@/utils/checks"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { useTranslations } from "next-intl"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const createSchema = ({
  t,
  config,
  productInventories,
}: {
  t: ReturnType<typeof useTranslations>
  config: InvoiceConfigSchemaT
  productInventories: ProductInventorySchemaT[]
}) => {
  const rowSchema = createInsertSchema(invoiceRow, {
    productId: (sch) => sch.productId.min(1),
    name: (sch) => sch.name.min(1),
    price: (sch) => sch.price.min(0),
    quantity: (sch) => sch.quantity.positive(),
  })
    .omit({
      id: true,
      createdAt: true,
      orgId: true,
      unitId: true,
      invoiceId: true,
      total: true,
      subtotal: true,
      tax: true,
    })
    .refine(
      (data) => {
        const inventory = productInventories.find(
          (inv) => inv.productId === data.productId
        )

        if (!inventory) return true

        const { minStock } = inventory
        const newStock = inventory.stock - data.quantity

        return newStock >= minStock
      },
      {
        path: ["quantity"],
        message: t("Quantity exceeds minimum stock"),
      }
    )

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
        if (
          checkShouldTriggerCash({
            invoiceConfig: config,
            payMethod: data.payMethod,
          })
        )
          return !!data.cashRegisterId

        return true
      },
      {
        path: ["cashRegisterId"],
        message: t("Cash register is required"),
      }
    )
    // prevent discount value to be greater than total
    .refine(
      (data) => {
        const total = data.rows.reduce(
          (acc, row) =>
            acc + row.quantity * row.price * taxTypeToPercentage(row.taxType),
          0
        )

        if (data.discountType === "value") return data.discountValue <= total

        return true
      },
      {
        path: ["discountValue"],
        message: t("Discount value cannot be greater than total"),
      }
    )

  return schema
}

type SchemaT = z.infer<ReturnType<typeof createSchema>>

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
  warehouseId: null,
}

const Provider = (
  props: PropsWithChildren<{
    defaultValues?: Partial<SchemaT>
    config: InvoiceConfigSchemaT
    productInventories: ProductInventorySchemaT[]
  }>
) => {
  const t = useTranslations()

  const schema = createSchema({
    t,
    config: props.config,
    productInventories: props.productInventories,
  })

  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...props.defaultValues },
  })

  return <Form {...form}>{props.children}</Form>
}

export { Provider as InvoiceFormProvider, type SchemaT as InvoiceFormSchemaT }
