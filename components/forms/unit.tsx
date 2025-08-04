"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useFormContext } from "react-hook-form"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UnitFormSchemaT } from "@/providers"
import { CircleDashedIcon, InfoIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { EntityStatusSelect } from "../select"

type SchemaT = UnitFormSchemaT

type Props = {
  performAction: (values: SchemaT) => Promise<void>
}

const formId: FormIdT = "unit"

const Form = ({ performAction }: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const { orgId } = useParams<{ orgId: string }>()

  const form = useFormContext<SchemaT>()

  const onValid = async (values: SchemaT) => {
    try {
      await performAction(values)
      toast.success(t("Unit saved successfully"))
      router.prefetch(`/o/${orgId}/unit/list/${values.status}`)
      router.push(`/o/${orgId}/unit/list/${values.status}`)
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
        className="mx-auto max-w-4xl space-y-2"
        onSubmit={form.handleSubmit(onValid, onInvalid)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault()
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <InfoIcon size={20} />
              {t("Details")}
            </CardTitle>
            <CardDescription>{t("Information about the unit")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Name")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Pizza" {...field} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Description")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Secondary unit")}
                      {...field}
                      value={field?.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <StatusCard />
      </form>
    </>
  )
}

const StatusCard = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CircleDashedIcon size={20} />
          {t("Status")}
        </CardTitle>
        <CardDescription>{t("Status of the unit")}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <EntityStatusSelect
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

export { Form as UnitForm }
