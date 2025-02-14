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
import { InvoiceFormSchemaT } from "@/providers/invoice-form"
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
        name="discountValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Discount amount")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                onFocus={(e) => e.target.select()}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
