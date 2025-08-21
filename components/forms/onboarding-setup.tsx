"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { OnboardingSetupFormSchemaT } from "@/providers"
import { Package, Truck, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useFormContext, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { OnboardingActions } from "../buttons"
import { UnitCommand } from "../command"

type Props = {
  performAction: (values: OnboardingSetupFormSchemaT) => Promise<void>
}

const Form = ({ performAction }: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const form = useFormContext<OnboardingSetupFormSchemaT>()

  const createSampleData = useWatch({
    control: form.control,
    name: "createSampleData",
  })

  const onValid = async (values: OnboardingSetupFormSchemaT) => {
    try {
      await performAction(values)
      router.refresh()
    } catch (error) {
      console.error("error", error)
      toast.error(t("Something went wrong") + "." + t("Please try again") + ".")
    }
  }

  const onInvalid = () => {
    toast.error(t("Please fill in all required fields"))
  }

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit(onValid, onInvalid)}
    >
      <FormField
        control={form.control}
        name="createSampleData"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2 rounded-lg bg-muted p-4">
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel className="cursor-pointer text-sm">
              {t("Create sample data to help me get started")}
            </FormLabel>
          </FormItem>
        )}
      />

      {createSampleData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                {t("First product")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="product.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Name")} *</FormLabel>
                    <FormControl>
                      <Input placeholder="Pizza" {...field} autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="product.price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Selling Price")} *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="0.00"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="product.unit"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col justify-end">
                      <FormLabel>{t("Unit")} *</FormLabel>
                      <UnitCommand
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {t("First customer")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="customer.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Name")}</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customer.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="demo@example.com"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                {t("Supplier & warehouse")} ({t("Optional")})
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="supplier.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Supplier name")}</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Supplier email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="demo@example.com"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warehouse.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Warehouse name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Warehouse 1")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warehouse.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Warehouse address")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("addressInputPlaceholder")}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {!createSampleData && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>
              {t("No sample data will be created")}.{" "}
              {t("You can add your data manually after completing the setup")}.
            </p>
          </CardContent>
        </Card>
      )}

      <OnboardingActions />
    </form>
  )
}

export { Form as OnboardingSetupForm }
