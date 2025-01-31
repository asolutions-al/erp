"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2Icon, Eraser, LoaderIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { PropsWithChildren } from "react"
import { useFormContext, useFormState } from "react-hook-form"

const FormActionBtns = ({
  formId,
  children,
}: PropsWithChildren<{ formId: FormId }>) => {
  const t = useTranslations()
  const form = useFormContext()
  const { isSubmitting, isValidating, isDirty } = useFormState({
    control: form.control,
  })

  const isProcessing = isSubmitting || isValidating

  return (
    <div className="flex items-center justify-end gap-2">
      {children}
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => form.reset()}
        disabled={isProcessing || !isDirty}
      >
        <Eraser />
        <span className="sr-only sm:not-sr-only">{t("Discard")}</span>
      </Button>
      <Button size="sm" type="submit" form={formId} disabled={isProcessing}>
        {isProcessing ? (
          <LoaderIcon className="animate-spin" />
        ) : (
          <CheckCircle2Icon />
        )}
        {t("Save")}
      </Button>
    </div>
  )
}

export { FormActionBtns }
