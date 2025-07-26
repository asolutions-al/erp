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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { role } from "@/orm/app/schema"
import { InvitationFormSchemaT } from "@/providers"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

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
          <CardTitle>Member Invitation</CardTitle>
          <CardDescription>
            Send an invitation to add a new member to your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email address"
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
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {role.enumValues.map((roleValue) => (
                      <SelectItem key={roleValue} value={roleValue}>
                        {t(roleValue)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
