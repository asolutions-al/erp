"use client"

import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const createSchema = ({ t }: { t: ReturnType<typeof useTranslations> }) => {
  return z.object({
    displayName: z.string().min(1),
  })
}

type SchemaT = z.infer<ReturnType<typeof createSchema>>

const defaultValues: SchemaT = {
  displayName: "",
}

const Provider = (
  props: PropsWithChildren<{ defaultValues?: Partial<SchemaT> }>
) => {
  const t = useTranslations()
  const schema = createSchema({ t })

  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...props.defaultValues },
  })

  return <Form {...form}>{props.children}</Form>
}

export {
  Provider as OnboardingWelcomeFormProvider,
  type SchemaT as OnboardingWelcomeFormSchemaT,
}
