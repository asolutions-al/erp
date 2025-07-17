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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  CashRegisterSchemaT,
  CustomerSchemaT,
  WarehouseSchemaT,
} from "@/db/app/schema"
import { payMethod } from "@/orm/app/schema"
import { InvoiceConfigFormSchemaT } from "@/providers"
import { EraserIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import {
  CashRegisterCommand,
  CustomerCommand,
  WarehouseCommand,
} from "../command"
import { Button } from "../ui/button"

type SchemaT = InvoiceConfigFormSchemaT

type Props = {
  performAction: (values: SchemaT) => Promise<void>
  warehouses: WarehouseSchemaT[]
  customers: CustomerSchemaT[]
  cashRegisters: CashRegisterSchemaT[]
}

const formId: FormIdT = "invoiceConfig"

const Form = ({
  performAction,
  warehouses,
  customers,
  cashRegisters,
}: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const { orgId, unitId } = useParams<GlobalParamsT>()
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
          <CustomerCard customers={customers} />
          <WarehouseCard warehouses={warehouses} />
          <CashRegisterCard cashRegisters={cashRegisters} />
          <SettingsCard />
        </div>
      </form>
    </>
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
              <Select value={field.value} onValueChange={field.onChange}>
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

const SettingsCard = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Settings")}</CardTitle>
        <CardDescription>{t("Configure additional settings")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="triggerCashOnInvoice"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>{t("Cash register on new invoice")}</FormLabel>
                <FormDescription>
                  {t(
                    "Automatically update balance after creating a new invoice"
                  )}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="triggerInventoryOnInvoice"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>{t("Inventory on new invoice")}</FormLabel>
                <FormDescription>
                  {t(
                    "Automatically update inventory after creating a new invoice"
                  )}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

const WarehouseCard = ({ warehouses }: { warehouses: WarehouseSchemaT[] }) => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <div className="space-y-1.5">
          <CardTitle>{t("Warehouse")}</CardTitle>
          <CardDescription>
            {t("Where the products are stored")}
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() =>
            form.setValue("warehouseId", null, { shouldDirty: true })
          }
        >
          <EraserIcon />
          {t("Clear")}
        </Button>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="warehouseId"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col">
                <WarehouseCommand
                  list={warehouses}
                  value={field.value || ""}
                  onChange={(value) => field.onChange(value)}
                />
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </CardContent>
    </Card>
  )
}

const CashRegisterCard = ({
  cashRegisters,
}: {
  cashRegisters: CashRegisterSchemaT[]
}) => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <div className="space-y-1.5">
          <CardTitle>{t("Cash register")}</CardTitle>
          <CardDescription>{t("Where cash is stored")}</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() =>
            form.setValue("cashRegisterId", null, { shouldDirty: true })
          }
        >
          <EraserIcon />
          {t("Clear")}
        </Button>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="cashRegisterId"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col">
                <CashRegisterCommand
                  list={cashRegisters}
                  value={field.value || ""}
                  onChange={(item) => field.onChange(item.id)}
                />
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </CardContent>
    </Card>
  )
}

const CustomerCard = ({ customers }: { customers: CustomerSchemaT[] }) => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <div className="space-y-1.5">
          <CardTitle>{t("Customer")}</CardTitle>
          <CardDescription>
            {t("The person that will receive the invoice")}
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() =>
            form.setValue("customerId", null, { shouldDirty: true })
          }
        >
          <EraserIcon />
          {t("Clear")}
        </Button>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => {
            const tabFiltered = customers

            return (
              <FormItem className="flex flex-col">
                <CustomerCommand
                  list={tabFiltered}
                  value={field.value || ""}
                  onChange={(value) => field.onChange(value)}
                />
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </CardContent>
    </Card>
  )
}

export { Form as InvoiceConfigForm }
