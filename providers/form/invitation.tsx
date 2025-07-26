"use client"

import { Form } from "@/components/ui/form"
import { invitation } from "@/orm/app/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { useTranslations } from "next-intl"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const createSchema = ({ t }: { t: ReturnType<typeof useTranslations> }) => {
  const schema = createInsertSchema(invitation, {
    email: (sch) => sch.email.min(1).email(),
  }).omit({
    id: true,
    createdAt: true,
    orgId: true,
    invitedBy: true,
    status: true,
  })

  return schema
}

type SchemaT = z.infer<ReturnType<typeof createSchema>>

const InvitationFormProvider = ({ children }: PropsWithChildren) => {
  const t = useTranslations()

  const form = useForm<SchemaT>({
    resolver: zodResolver(createSchema({ t })),
    defaultValues: {
      email: "",
      role: "member",
    },
  })

  return <Form {...form}>{children}</Form>
}

export { InvitationFormProvider, type SchemaT as InvitationFormSchemaT }
