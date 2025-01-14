"use client"

import { CheckCircle2Icon, Eraser } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"
import { Button } from "../ui/button"

const FormActionBtns = ({ formId }: { formId: FormId }) => {
  const t = useTranslations()
  const form = useFormContext()
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => form.reset()}
      >
        <Eraser size={15} className="mr-1" />
        {t("Discard")}
      </Button>
      <Button size="sm" type="submit" form={formId}>
        <CheckCircle2Icon size={15} className="mr-1" />
        {t("Save")}
      </Button>
    </div>
  )
}

export { FormActionBtns }
