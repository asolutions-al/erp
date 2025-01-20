"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2Icon, Eraser, LoaderIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFormContext, useFormState } from "react-hook-form"

const FormActionBtns = ({ formId }: { formId: FormId }) => {
  const t = useTranslations()
  const form = useFormContext()
  const { isSubmitting, isValidating } = useFormState({
    control: form.control,
  })

  const isProcessing = isSubmitting || isValidating

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => form.reset()}
        disabled={isProcessing}
      >
        <Eraser size={15} className="mr-1" />
        {t("Discard")}
      </Button>
      <Button size="sm" type="submit" form={formId} disabled={isProcessing}>
        {isProcessing ? (
          <LoaderIcon size={15} className="mr-1 animate-spin" />
        ) : (
          <CheckCircle2Icon size={15} className="mr-1" />
        )}
        {t("Save")}
      </Button>
    </div>
  )
}

export { FormActionBtns }
