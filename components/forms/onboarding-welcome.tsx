"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { OnboardingWelcomeFormSchemaT } from "@/providers"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { OnboardingActions } from "../buttons"

type Props = {
  performAction: (values: OnboardingWelcomeFormSchemaT) => Promise<void>
  user: {
    email: string
  }
}

const Form = ({ performAction, user }: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const form = useFormContext<OnboardingWelcomeFormSchemaT>()

  const onValid = async (values: OnboardingWelcomeFormSchemaT) => {
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
      <div className="space-y-2">
        <FormLabel htmlFor="email">{t("Email Address")}</FormLabel>
        <Input
          id="email"
          type="email"
          value={user.email}
          disabled
          className="bg-muted"
        />
      </div>

      <FormField
        control={form.control}
        name="displayName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Display Name")} *</FormLabel>
            <FormControl>
              <Input
                placeholder={t("Enter your display name")}
                maxLength={100}
                {...field}
              />
            </FormControl>
            <p className="text-sm text-muted-foreground">
              {t(
                "This is how you'll appear to other users in your organization"
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

export { Form as OnboardingWelcomeForm }
