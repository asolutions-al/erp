"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InvitationFormSchemaT } from "@/providers"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { RoleSelect } from "../select"

type SchemaT = InvitationFormSchemaT

type Props = {
  performAction: (values: SchemaT) => Promise<ResT<{ invitationId: string }>>
}

const formId: FormIdT = "invitation"

const Form = ({ performAction }: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const form = useFormContext<SchemaT>()

  const handleSubmit = async (values: SchemaT) => {
    const { error, success } = await performAction(values)

    if (error) {
      toast.error(error.message)
    }

    if (success) {
      toast.success("Invitation sent successfully")
      router.back()
    }
  }

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(handleSubmit)}
      className="mx-auto max-w-2xl space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>{t("Member Invitation")}</CardTitle>
          <CardDescription>
            {t("Send an invitation to add a new member to your organization")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Email Address")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("Enter email address")}
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <RoleSelect value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </form>
  )
}

export { Form as InvitationForm }
