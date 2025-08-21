"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { OnboardingOrgFormSchemaT } from "@/providers"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { OnboardingActions } from "../buttons"

type Props = {
  performAction: (values: OnboardingOrgFormSchemaT) => Promise<void>
}

const Form = ({ performAction }: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const form = useFormContext<OnboardingOrgFormSchemaT>()

  const onValid = async (values: OnboardingOrgFormSchemaT) => {
    try {
      await performAction(values)
      router.refresh()
    } catch (error) {
      console.error("error", error)
      toast.error(t("Something went wrong") + "." + t("Please try again") + ".")
    }
  }

  const onInvalid = () => {
    toast.error(t("Please fill in all required fields"))
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(onValid, onInvalid)}
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Organization name")}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your organization name"
                maxLength={100}
                {...field}
              />
            </FormControl>
            <p className="text-sm text-muted-foreground">
              {t(
                "This could be your company name or any name that represents your business"
              )}
              .
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Description")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Briefly describe your organization..."
                rows={3}
                maxLength={500}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <p className="text-sm text-muted-foreground">
              {t("A brief description of what your organization does")}.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <OnboardingActions />
    </form>
  )
}

export { Form as OnboardingOrgForm }
