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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { OrgSchemaT } from "@/db/app/schema"
import { UserFormSchemaT } from "@/providers"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

type SchemaT = UserFormSchemaT

type Props = {
  performAction: (values: SchemaT) => Promise<void>
  orgs: OrgSchemaT[]
}

const formId: FormIdT = "user"

const Form = ({ performAction, orgs }: Props) => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  const onValid = async (values: SchemaT) => {
    try {
      await performAction(values)
      toast.success(t("User saved successfully"))
    } catch (error) {
      console.error("error", error)
      toast.error(t("An error occurred"))
    }
  }

  const onInvalid = () => {
    toast.error(t("Please fill in all required fields"))
  }

  return (
    <>
      <form
        id={formId}
        className="mx-auto max-w-4xl"
        onSubmit={form.handleSubmit(onValid, onInvalid)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault()
        }}
      >
        <div className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("Display name")}</CardTitle>
              <CardDescription>
                {t(
                  "Your full name, or a display name you are comfortable with"
                )}
                .
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Default organization")}</CardTitle>
              <CardDescription>
                {t(
                  "The organization selected when you first navigate to the dashboard"
                )}
                .
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="defaultOrgId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger aria-label={t("Select organization")}>
                          <SelectValue placeholder={t("Select organization")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {orgs.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
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

          <Card>
            <CardHeader>
              <CardTitle>{t("Delete account")}</CardTitle>
              <CardDescription>
                {t(
                  "Permanently remove your Personal Account and all of its contents from our platform"
                )}
                .{" "}
                {t(
                  "This action is not reversible, so please continue with caution"
                )}
                .
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" type="button" disabled>
                {t("Delete account")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </>
  )
}

export { Form as UserForm }
