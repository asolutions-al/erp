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
import { mapPayMethodIcon } from "@/constants/maps"
import {
  CashRegisterSchemaT,
  CustomerSchemaT,
  WarehouseSchemaT,
} from "@/db/app/schema"
import { payMethod } from "@/orm/app/schema"
import { InvoiceConfigFormSchemaT } from "@/providers"
import {
  BanknoteIcon,
  ContactIcon,
  CreditCardIcon,
  EraserIcon,
  SettingsIcon,
  WarehouseIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useFormContext, useWatch } from "react-hook-form"
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
        id={formId}
        className="mx-auto max-w-4xl"
        onSubmit={form.handleSubmit(onValid, onInvalid)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault()
        }}
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
  const value = useWatch({ control: form.control, name: "payMethod" })

  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon size={20} />
            {t("Pay method")}
          </CardTitle>
          <CardDescription>{t("How the customer will pay")}</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          disabled={!value}
          onClick={() =>
            form.setValue("payMethod", null, { shouldDirty: true })
          }
        >
          <EraserIcon />
          {t("Clear")}
        </Button>
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
                  {payMethod.enumValues.map((item) => {
                    const Icon = mapPayMethodIcon(item)
                    return (
                      <SelectItem key={item} value={item}>
                        <span className="flex items-center gap-1">
                          <Icon size={15} />
                          {t(item)}
                        </span>
                      </SelectItem>
                    )
                  })}
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
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon size={20} />
          {t("Settings")}
        </CardTitle>
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
  const value = useWatch({ control: form.control, name: "warehouseId" })

  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <WarehouseIcon size={20} />
            {t("Warehouse")}
          </CardTitle>
          <CardDescription>
            {t("Where the products are stored")}
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          disabled={!value}
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
  const value = useWatch({
    control: form.control,
    name: "cashRegisterId",
  })

  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <BanknoteIcon size={20} />
            {t("Cash register")}
          </CardTitle>
          <CardDescription>{t("Where cash is stored")}</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          disabled={!value}
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
  const value = useWatch({
    control: form.control,
    name: "customerId",
  })

  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <ContactIcon size={20} />
            {t("Customer")}
          </CardTitle>
          <CardDescription>
            {t("The person that will receive the invoice")}
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          disabled={!value}
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
