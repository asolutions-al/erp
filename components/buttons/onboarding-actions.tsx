"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ArrowRightIcon, LoaderIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFormContext, useFormState } from "react-hook-form"

const OnboardingActions = () => {
  const t = useTranslations()
  const form = useFormContext()
  const { isSubmitting, isValidating } = useFormState({
    control: form.control,
  })

  const isProcessing = isSubmitting || isValidating

  return (
    <div className="flex justify-between gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={async () => {
          // TODO: Implement skip logic
        }}
      >
        <ArrowLeftIcon />
        {t("Skip")}
      </Button>
      <Button type="submit" disabled={isProcessing}>
        {isProcessing ? (
          <LoaderIcon className="animate-spin" />
        ) : (
          <ArrowRightIcon />
        )}
        {t("Next")}
      </Button>
    </div>
  )
}

export { OnboardingActions }
