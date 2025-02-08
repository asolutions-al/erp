"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CustomerSchemaT } from "@/db/app/schema"
import { currency, payMethod } from "@/orm/app/schema"
import { InvoiceConfigFormSchemaT } from "@/providers/invoice-config-form"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

type SchemaT = InvoiceConfigFormSchemaT

type Props = {
  performAction: (values: SchemaT) => Promise<void>
  customers: CustomerSchemaT[]
}

const formId: FormId = "invoiceConfig"

const Form = ({ performAction, customers }: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const { orgId, unitId } = useParams<{ orgId: string; unitId: string }>()
  const form = useFormContext<SchemaT>()

  const onValid = async (values: SchemaT) => {
    try {
      await performAction(values)
      toast.success(t("Config saved successfully"))
      router.prefetch(`/o/${orgId}/u/${unitId}/invoice/create`)
      router.push(`/o/${orgId}/u/${unitId}/invoice/create`)
    } catch (error) {
      console.error("error", error)
      toast.error(t("An error occurred"))
    }
  }

  const onInvalid = () => {
    toast.error(t("Please fill in all required fields"))
  }

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onValid, onInvalid)}
        className="mx-auto max-w-4xl"
        id={formId}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <PayMethodCard />
          <CurrencyCard />
          <CustomerCard customers={customers} />
        </div>
      </form>
    </>
  )
}

const CustomerCard = ({ customers }: { customers: CustomerSchemaT[] }) => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Customer")}</CardTitle>
        <CardDescription>{t("Customer of the invoice")}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger aria-label={t("Select customer")}>
                    <SelectValue placeholder={t("Select customer")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

const PayMethodCard = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Pay method")}</CardTitle>
        <CardDescription>{t("How the customer will pay")}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="payMethod"
          render={({ field }) => (
            <FormItem>
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger aria-label={t("Select pay method")}>
                    <SelectValue placeholder={t("Select pay method")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {payMethod.enumValues.map((item) => (
                    <SelectItem key={item} value={item}>
                      {t(item)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

const CurrencyCard = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Currency")}</CardTitle>
        <CardDescription>{t("Currency of the invoice")}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger aria-label={t("Select currency")}>
                    <SelectValue placeholder={t("Select currency")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currency.enumValues.map((item) => (
                    <SelectItem key={item} value={item}>
                      {t(item)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

export { Form as InvoiceConfigForm }
