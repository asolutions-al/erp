"use client"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { currency } from "@/orm/app/schema"
import { InvoiceFormSchemaT } from "@/providers/invoice-form"
import { useTranslations } from "next-intl"
import { useFormContext, useWatch } from "react-hook-form"

type SchemaT = InvoiceFormSchemaT

const InvoiceOptions = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  const currencyValue = useWatch({
    control: form.control,
    name: "currency",
  })

  return (
    <>
      <FormField
        control={form.control}
        name="currency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Currency")}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("Select currency")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {currency.enumValues.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {currencyValue && currencyValue !== "all" && (
        <FormField
          control={form.control}
          name="exchangeRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Exchange rate")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  onFocus={(e) => e.target.select()}
                  min="0"
                  step="0.0001"
                />
              </FormControl>
              <FormDescription>
                {t("Enter the exchange rate from currency to ALL", {
                  currency: currencyValue.toUpperCase(),
                })}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="discountValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Discount amount")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                onFocus={(e) => e.target.select()}
                min="0"
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
