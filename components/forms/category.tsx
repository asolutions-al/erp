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
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { CategoryFormSchemaT } from "@/providers"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

type SchemaT = CategoryFormSchemaT

type Props = {
  performAction: (values: SchemaT) => Promise<void>
}

const formId: FormIdT = "category"

const Form = ({ performAction }: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const { orgId, unitId } = useParams<GlobalParamsT>()
  const form = useFormContext<SchemaT>()

  const onValid = async (values: SchemaT) => {
    try {
      await performAction(values)
      toast.success(t("Category saved successfully"))
      router.prefetch(`/o/${orgId}/u/${unitId}/category/list/${values.status}`)
      router.push(`/o/${orgId}/u/${unitId}/category/list/${values.status}`)
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DetailsCard />
          <SettingsCard />
        </div>
      </form>
    </>
  )
}

const DetailsCard = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Information")}</CardTitle>
        <CardDescription>{t("Basic details of the category")}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Name")}</FormLabel>
              <FormControl>
                <Input placeholder="Clothing" {...field} />
              </FormControl>
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
        <CardDescription>
          {t("Configure additional settings for the category")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="isFavorite"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>{t("Favorite")}</FormLabel>
                <FormDescription>
                  {t("Mark this category as a favorite")}
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
          name="forProduct"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>{t("Used for products")}</FormLabel>
                <FormDescription>
                  {t("Use this category for products")}
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
          name="forCustomer"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>{t("Used for customers")}</FormLabel>
                <FormDescription>
                  {t("Use this category for customers")}
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

export { Form as CategoryForm }
