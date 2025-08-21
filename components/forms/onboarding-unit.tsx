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
import type { OnboardingUnitFormSchemaT } from "@/providers"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { OnboardingActions } from "../buttons"

type Props = {
  performAction: (values: OnboardingUnitFormSchemaT) => Promise<void>
}

const Form = ({ performAction }: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const form = useFormContext<OnboardingUnitFormSchemaT>()

  const onValid = async (values: OnboardingUnitFormSchemaT) => {
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
            <FormLabel>{t("Business unit name")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("Main Store, Sales Department, Warehouse")}
                maxLength={100}
                {...field}
              />
            </FormControl>
            <p className="text-sm text-muted-foreground">
              {t(
                "This could be your main store, department, or any business division"
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
                placeholder={
                  t("Describe what this business unit handles") + "..."
                }
                rows={3}
                maxLength={500}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <p className="text-sm text-muted-foreground">
              {t(
                "A brief description of what this business unit is responsible for"
              )}
              .
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <OnboardingActions />
    </form>
  )
}

export { Form as OnboardingUnitForm }
