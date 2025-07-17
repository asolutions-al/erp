"use client"

import { Form } from "@/components/ui/form"
import { InvoiceConfigSchemaT, ProductInventorySchemaT } from "@/db/app/schema"
import { invoice, invoiceRow } from "@/orm/app/schema"
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
    .refine(
      (data) => {
        if (config.triggerInventoryOnInvoice) return !!data.warehouseId

        return true
      },
      {
        path: ["warehouseId"],
        message: t("Warehouse is required"),
      }
    )
    .refine(
      (data) => {
        const total = data.rows.reduce(
          (acc, row) => acc + row.quantity * row.price * row.taxPercentage,
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
    .superRefine((data, ctx) => {
      // Validate inventory for each row with warehouse context
      data.rows.forEach((row, index) => {
        const inventory = productInventories.find(
          (inv) =>
            inv.productId === row.productId &&
            inv.warehouseId === data.warehouseId
        )

        if (inventory) {
          const { minStock } = inventory
          const newStock = inventory.stock - row.quantity

          if (newStock < minStock) {
            ctx.addIssue({
              code: "custom",
              path: ["rows", index, "quantity"],
              message: t("Quantity exceeds minimum stock ( {minStock} )", {
                minStock,
              }),
            })
          }
        }
      })
    })

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
