"use client"

import { Form } from "@/components/ui/form"
import { unit } from "@/orm/app/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const createSchema = () => {
  const schema = createInsertSchema(unit, {
    name: (sch) => sch.name.min(1),
  }).omit({
    id: true,
    orgId: true,
    createdAt: true,
    status: true,
  })

  return schema
}

type SchemaT = z.infer<ReturnType<typeof createSchema>>

const defaultValues: SchemaT = {
  name: "",
  description: null,
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
  Provider as OnboardingUnitFormProvider,
  type SchemaT as OnboardingUnitFormSchemaT,
}
