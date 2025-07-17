"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { InvoiceFormSchemaT } from "@/providers"
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"

type SchemaT = InvoiceFormSchemaT

const InvoiceOptions = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <>
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Notes")}</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value || ""}
                placeholder={t("A short note about the invoice")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export { InvoiceOptions }
