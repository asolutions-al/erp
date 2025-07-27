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
import { ImageUploader } from "@/components/ui/image-uploader"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { customerImageBucket } from "@/constants/bucket"
import { idType } from "@/orm/app/schema"
import { CustomerFormSchemaT } from "@/providers"
import { InfoIcon, SettingsIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { EntityStatusSelect } from "../select/entity-status"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

type SchemaT = CustomerFormSchemaT

type Props = {
  performAction: (values: SchemaT) => Promise<void>
}

type TabT = "info" | "config"

const formId: FormIdT = "customer"

const Form = ({ performAction }: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const { orgId, unitId } = useParams<GlobalParamsT>()
  const form = useFormContext<SchemaT>()

  const searchParams = useSearchParams()
  const currentTab: TabT = (searchParams.get("tab") as TabT) || "info"

  // Function to update URL with current tab
  const updateTabInUrl = (tab: TabT) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    window.history.replaceState(null, "", `?${params.toString()}`)
  }

  const onValid = async (values: SchemaT) => {
    try {
      await performAction(values)
      toast.success(t("Customer saved successfully"))
      router.prefetch(`/o/${orgId}/u/${unitId}/customer/list/${values.status}`)
      router.push(`/o/${orgId}/u/${unitId}/customer/list/${values.status}`)
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
        <Tabs
          value={currentTab}
          onValueChange={(value) => updateTabInUrl(value as TabT)}
        >
          <TabsList className="grid max-w-xl grid-cols-2">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <InfoIcon size={20} />
              <span className="sr-only sm:not-sr-only">{t("Information")}</span>
            </TabsTrigger>

            <TabsTrigger value="config" className="flex items-center gap-2">
              <SettingsIcon size={20} />
              <span className="sr-only sm:not-sr-only">
                {t("Configuration")}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="info"
            className="grid grid-cols-1 gap-2 sm:grid-cols-3"
          >
            <div className="space-y-2 lg:col-span-2">
              <IdentityCard />
              <LocationCard />
              <AdditionalCard />
            </div>
            <div>
              <ImageCard />
            </div>
          </TabsContent>
          <TabsContent value="config" className="grid gap-2 sm:grid-cols-2">
            <StatusCard />
            <SettingsCard />
          </TabsContent>
        </Tabs>
      </form>
    </>
  )
}

const ImageCard = () => {
  // Remove the old ImageCard implementation and use the reusable component
  return (
    <ImageUploader
      bucket={customerImageBucket}
      field="imageBucketPath"
      title="Images"
      description="Appealing images of the customer"
    />
  )
}

const IdentityCard = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Identity")}</CardTitle>
        <CardDescription>{t("Basic details of the customer")}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="name"
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
        <div className="grid grid-cols-3 gap-2">
          <FormField
            control={form.control}
            name="idType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Id type")}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger aria-label={t("Select id type")}>
                      <SelectValue placeholder={t("Select id type")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {idType.enumValues.map((item) => (
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
          <FormField
            control={form.control}
            name="idValue"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{t("Id")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1234567890"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
const LocationCard = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Location")}</CardTitle>
        <CardDescription>
          {t("Address details of the customer")}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("City")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("cityInputPlaceholder")}
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Address")}</FormLabel>
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
  )
}

const AdditionalCard = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Additional")}</CardTitle>
        <CardDescription>{t("Extra details of the customer")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <FormField
          control={form.control}
          name="email"
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "Blue eyes, blond hair, 6 feet tall, likes to play basketball"
                  )}
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
          {t("Configure additional customer settings")}
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
                  {t("Mark this customer as a favorite")}
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
        {/* Add more toggles here as needed */}
      </CardContent>
    </Card>
  )
}

const StatusCard = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Status")}</CardTitle>
        <CardDescription>{t("Current status of the customer")}</CardDescription>
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

export { Form as CustomerForm }
