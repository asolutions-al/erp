"use client"

import {
  FormControl,
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
import { CashRegisterSchemaT, InvoiceConfigSchemaT } from "@/db/app/schema"
import { InvoiceFormSchemaT } from "@/providers/invoice-form"
import { checkShouldTriggerCash } from "@/utils/checks"
import { useTranslations } from "next-intl"
import { useFormContext, useWatch } from "react-hook-form"

type SchemaT = InvoiceFormSchemaT

const InvoiceOptions = ({
  cashRegisters,
  invoiceConfig,
}: {
  cashRegisters: CashRegisterSchemaT[]
  invoiceConfig: InvoiceConfigSchemaT
}) => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  const [payMethod] = useWatch({
    control: form.control,
    name: ["payMethod"],
  })

  const shouldTriggerCash = checkShouldTriggerCash({ invoiceConfig, payMethod })

  return (
    <>
      {shouldTriggerCash && (
        <FormField
          control={form.control}
          name="cashRegisterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Cash register")}</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                defaultValue={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select cash register")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cashRegisters.map((register) => (
                    <SelectItem key={register.id} value={register.id}>
                      {register.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                {...field}
                type="number"
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
