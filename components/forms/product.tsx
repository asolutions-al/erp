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
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useFormContext } from "react-hook-form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { productImagesBucket } from "@/contants/bucket"
import { publicStorageUrl } from "@/contants/consts"
import { createClient } from "@/db/app/client"
import { cn } from "@/lib/utils"
import { productUnit, status, tax } from "@/orm/app/schema"
import { ProductFormSchemaT } from "@/providers/product-form"
import { CheckIcon, ChevronsUpDownIcon, UploadIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type SchemaT = ProductFormSchemaT

type Props = {
  performAction: (values: SchemaT) => Promise<void>
}

const formId: FormId = "product"

const Form = ({ performAction }: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const { orgId, unitId } = useParams<{ orgId: string; unitId: string }>()
  const form = useFormContext<SchemaT>()

  const [imgFile, setImgFile] = useState<File>()

  const defaultImgBucketPath = form.formState.defaultValues?.imageBucketPath

  const onValid = async (values: SchemaT) => {
    try {
      let imgPath: SchemaT["imageBucketPath"]

      if (imgFile) {
        imgPath = nanoid() // new path
        const client = createClient()
        client.storage.from(productImagesBucket).upload(imgPath, imgFile) // optimistic
      } else {
        imgPath = defaultImgBucketPath // keep the same path
      }

      await performAction({
        ...values,
        imageBucketPath: imgPath,
      })
      toast.success(t("Product saved successfully"))
      router.push(`/org/${orgId}/${unitId}/product/list`)
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-2">
            <DetailsCard />
            <PriceCard />
            <ExtraDetailsCard />
          </div>
          <div className="space-y-4">
            <StatusCard />
            <Card>
              <CardHeader>
                <CardTitle>{t("Product images")}</CardTitle>
                <CardDescription>
                  {t("Manage images of the product")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Image
                    alt={t("Product image")}
                    className="aspect-square w-full rounded-md object-cover"
                    height="300"
                    src={
                      imgFile
                        ? URL.createObjectURL(imgFile)
                        : defaultImgBucketPath
                          ? `${publicStorageUrl}/${productImagesBucket}/${defaultImgBucketPath}`
                          : "/placeholder.svg"
                    }
                    width="300"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Image
                      alt="Product image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="84"
                      src="/placeholder.svg"
                      width="84"
                    />
                    <Image
                      alt="Product image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="84"
                      src="/placeholder.svg"
                      width="84"
                    />
                    <button
                      className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
                      onClick={(e) => {
                        e.preventDefault()
                        const input = document.createElement("input")
                        input.type = "file"
                        input.accept = "image/*"
                        input.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files
                          const file = files?.[0]
                          if (!file) return
                          setImgFile(file)
                        }
                        input.click()
                      }}
                    >
                      <UploadIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Upload</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </>
  )
}

const DetailsCard = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()
  const [popOverOpen, setPopOverOpen] = useState(false)

  const productUnitList = productUnit.enumValues.map((unit) => ({
    value: unit,
    label: t(unit),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Details")}</CardTitle>
        <CardDescription>{t("Information about the product")}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Name")}</FormLabel>
              <FormControl>
                <Input placeholder="Pizza" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>{t("Unit")}</FormLabel>
                <Popover open={popOverOpen} onOpenChange={setPopOverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={popOverOpen}
                      className="justify-between"
                    >
                      {field.value
                        ? productUnitList.find(
                            (unit) => unit.value === field.value
                          )?.label
                        : `${t("Select unit")}...`}
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder={t("Search unit") + "..."} />
                      <CommandList>
                        <CommandEmpty>{t("No unit found")}.</CommandEmpty>
                        <CommandGroup>
                          {productUnitList.map((unit) => {
                            const { value, label } = unit
                            const isActive = field.value === value
                            return (
                              <CommandItem
                                key={value}
                                value={label}
                                onSelect={() => {
                                  field.onChange(value)
                                  setPopOverOpen(false)
                                }}
                              >
                                <span>{label}</span>
                                <CheckIcon
                                  size={16}
                                  className={cn(
                                    "ml-auto",
                                    isActive ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </CardContent>
    </Card>
  )
}

const PriceCard = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Price")}</CardTitle>
        <CardDescription>
          {t("Price information of the product")}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Price")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
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
          name="tax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Tax")}</FormLabel>
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger aria-label={t("Select tax")}>
                    <SelectValue placeholder={t("Select tax")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tax.enumValues.map((item) => (
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

const ExtraDetailsCard = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Extra")}</CardTitle>
        <CardDescription>
          {t("Extra information about the product")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Barcode")}</FormLabel>
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
        <div className="grid grid-cols-2 gap-4"></div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "A fancy pizza with pepperoni, mushrooms, and olives"
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

const StatusCard = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Status")}</CardTitle>
        <CardDescription>{t("Status of the product")}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Status")}</FormLabel>
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger aria-label={t("Select status")}>
                    <SelectValue placeholder={t("Select status")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {status.enumValues.map((item) => (
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

export { Form as ProductForm }
