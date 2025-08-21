"use client"

import { Form } from "@/components/ui/form"
import { customer, product, supplier, warehouse } from "@/orm/app/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const createSchema = () => {
  const productSchema = createInsertSchema(product, {
    name: (sch) => sch.name.min(1),
    price: (sch) => sch.price.min(0),
  }).pick({
    name: true,
    price: true,
    unit: true,
  })

  const customerSchema = createInsertSchema(customer, {
    name: (sch) => sch.name.min(1),
  }).pick({
    name: true,
    email: true,
  })

  const supplierSchema = createInsertSchema(supplier, {
    name: (sch) => sch.name.min(1),
  }).pick({
    name: true,
    email: true,
  })

  const warehouseSchema = createInsertSchema(warehouse, {
    name: (sch) => sch.name.min(1),
  }).pick({
    name: true,
    address: true,
  })

  return z
    .object({
      createSampleData: z.boolean().default(true),
      product: productSchema,
      customer: customerSchema,
      supplier: supplierSchema,
      warehouse: warehouseSchema,
    })
    .superRefine((data, ctx) => {
      if (data.createSampleData) {
        if (!data.product) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Product is required when creating sample data",
            path: ["product"],
          })
        }

        if (!data.customer) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Customer is required when creating sample data",
            path: ["customer"],
          })
        }

        if (!data.supplier) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Supplier is required when creating sample data",
            path: ["supplier"],
          })
        }
      }
    })
}

type SchemaT = z.infer<ReturnType<typeof createSchema>>

const defaultValues: SchemaT = {
  createSampleData: true,
  product: {
    name: "",
    price: 0,
    unit: "XPP",
  },
  customer: {
    name: "",
    email: null,
  },
  supplier: {
    name: "",
    email: null,
  },
  warehouse: {
    name: "",
    address: null,
  },
}

const Provider = (
  props: PropsWithChildren<{ defaultValues?: Partial<SchemaT> }>
) => {
  const schema = createSchema()

  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...props.defaultValues },
  })

  return <Form {...form}>{props.children}</Form>
}

export {
  Provider as OnboardingSetupFormProvider,
  type SchemaT as OnboardingSetupFormSchemaT,
}
