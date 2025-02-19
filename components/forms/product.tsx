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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { productImagesBucket } from "@/contants/bucket"
import { publicStorageUrl } from "@/contants/consts"
import { createClient } from "@/db/app/client"
import { WarehouseSchemaT } from "@/db/app/schema"
import { cn } from "@/lib/utils"
import { entityStatus, productUnit, taxType } from "@/orm/app/schema"
import { ProductFormSchemaT } from "@/providers/product-form"
import {
  CheckIcon,
  ChevronsUpDownIcon,
  InfoIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
  UploadIcon,
  WarehouseIcon,
} from "lucide-react"
import { nanoid } from "nanoid"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
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
import { Switch } from "../ui/switch"

type SchemaT = ProductFormSchemaT

type Props = {
  performAction: (values: SchemaT) => Promise<void>
  warehouses: WarehouseSchemaT[]
}

const formId: FormId = "product"

const Form = ({ performAction, warehouses }: Props) => {
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
      router.prefetch(`/o/${orgId}/u/${unitId}/product/list/${values.status}`)
      router.push(`/o/${orgId}/u/${unitId}/product/list/${values.status}`)
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
        <Tabs defaultValue="information">
          <TabsList className="grid max-w-lg grid-cols-3">
            <TabsTrigger
              value="information"
              className="flex items-center gap-2"
            >
              <InfoIcon size={20} />
              {t("Information")}
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <WarehouseIcon size={20} />
              {t("Inventory")}
            </TabsTrigger>
            <TabsTrigger
              value="configuration"
              className="flex items-center gap-2"
            >
              <SettingsIcon size={20} />
              {t("Configuration")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inventory">
            <InventoryTab warehouses={warehouses} />
          </TabsContent>
          <TabsContent
            value="information"
            className="grid grid-cols-1 gap-2 sm:grid-cols-3"
          >
            <div className="space-y-2 sm:col-span-2">
              <DetailsCard />
              <PriceCard />
              <ExtraDetailsCard />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{t("Images")}</CardTitle>
                  <CardDescription>
                    {t("Upload and manage product images")}
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
          </TabsContent>
          <TabsContent
            value="configuration"
            className="grid gap-2 sm:grid-cols-2"
          >
            <StatusCard />
            <SettingsCard />
          </TabsContent>
        </Tabs>
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
        <CardTitle>{t("Information")}</CardTitle>
        <CardDescription>{t("Basic details of the product")}</CardDescription>
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
        <CardTitle>{t("Pricing")}</CardTitle>
        <CardDescription>{t("Tax, price and other details")}</CardDescription>
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
                  {...field}
                  type="number"
                  placeholder="0.00"
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  onFocus={(e) => e.target.select()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="taxType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Tax")}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger aria-label={t("Select tax")}>
                    <SelectValue placeholder={t("Select tax")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {taxType.enumValues.map((item) => (
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
        <CardTitle>{t("Additional")}</CardTitle>
        <CardDescription>
          {t("Extra details to better describe the product")}
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
                  {...field}
                  placeholder="1234567890"
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
                  {...field}
                  placeholder={t(
                    "A fancy pizza with pepperoni, mushrooms, and olives"
                  )}
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
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger aria-label={t("Select status")}>
                    <SelectValue placeholder={t("Select status")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {entityStatus.enumValues.map((item) => (
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
        <CardDescription>
          {t("Configure additional product settings")}
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
                  {t("Mark this product as a favorite")}
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

export const InventoryTab = ({
  warehouses,
}: {
  warehouses: WarehouseSchemaT[]
}) => {
  const t = useTranslations()
  const form = useFormContext<ProductFormSchemaT>()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rows",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Inventory")}</CardTitle>
        <CardDescription>
          {t("Manage product inventory across warehouses")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2">
            <div className="grid grid-cols-5 items-end gap-2">
              <FormField
                control={form.control}
                name={`rows.${index}.warehouseId`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t("Warehouse")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select warehouse")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {warehouses.map((warehouse) => (
                          <SelectItem key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
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
                name={`rows.${index}.stock`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Stock")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value, 10))
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
                name={`rows.${index}.minStock`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Min stock")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value, 10))
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
                name={`rows.${index}.maxStock`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Max stock")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value, 10))
                        }
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
              >
                <TrashIcon />
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-5"
          onClick={() =>
            append({ warehouseId: "", stock: 0, minStock: 0, maxStock: 0 })
          }
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("Add warehouse")}
        </Button>
      </CardContent>
    </Card>
  )
}

export { Form as ProductForm }
