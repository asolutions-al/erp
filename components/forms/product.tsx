"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { productImagesBucket } from "@/contants/bucket"
import type { CategorySchemaT, WarehouseSchemaT } from "@/db/app/schema"
import { cn } from "@/lib/utils"
import { productUnit } from "@/orm/app/schema"
import type { ProductFormSchemaT } from "@/providers"
import {
  BriefcaseBusinessIcon,
  CheckCircleIcon,
  ChevronsUpDownIcon,
  InfoIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
  WarehouseIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { CategoryCommand, WarehouseCommand } from "../command"
import { EntityStatusSelect } from "../select/entity-status"

type SchemaT = ProductFormSchemaT

type Props = {
  performAction: (values: SchemaT) => Promise<void>
  warehouses: WarehouseSchemaT[]
  categories: CategorySchemaT[]
}

const formId: FormIdT = "product"

const Form = ({ performAction, warehouses, categories }: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const { orgId, unitId } = useParams<GlobalParamsT>()
  const form = useFormContext<SchemaT>()

  const onValid = async (values: SchemaT) => {
    try {
      await performAction(values)
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
        id={formId}
        className="mx-auto max-w-4xl"
        onSubmit={form.handleSubmit(onValid, onInvalid)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault()
        }}
      >
        <Tabs defaultValue="information">
          <TabsList className="grid max-w-xl grid-cols-4">
            <TabsTrigger
              value="information"
              className="flex items-center gap-2"
            >
              <InfoIcon size={20} />
              <span className="sr-only sm:not-sr-only">{t("Information")}</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <WarehouseIcon size={20} />
              <span className="sr-only sm:not-sr-only">{t("Inventory")}</span>
            </TabsTrigger>
            <TabsTrigger value="category" className="flex items-center gap-2">
              <BriefcaseBusinessIcon size={20} />
              <span className="sr-only sm:not-sr-only">{t("Category")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="configuration"
              className="flex items-center gap-2"
            >
              <SettingsIcon size={20} />
              <span className="sr-only sm:not-sr-only">
                {t("Configuration")}
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inventory">
            <InventoryTab warehouses={warehouses} />
          </TabsContent>
          <TabsContent value="category">
            <CategoryTab categories={categories} />
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
              <ImageCard />
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

const ImageCard = () => {
  // Remove the old ImageCard implementation and use the reusable component
  return (
    <ImageUploader
      bucket={productImagesBucket}
      field="imageBucketPath"
      title="Images"
      description="Upload and manage product image"
    />
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
                                <CheckCircleIcon
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
              <FormLabel>{t("Selling Price")}</FormLabel>
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
          name="purchasePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Purchase Price")}</FormLabel>
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
          name="taxPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Tax")} (%)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="0"
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  onFocus={(e) => e.target.select()}
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

const InventoryTab = ({ warehouses }: { warehouses: WarehouseSchemaT[] }) => {
  const t = useTranslations()
  const form = useFormContext<ProductFormSchemaT>()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "inventoryRows",
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
        {fields.map((field, index) => {
          // prevent selecting the same warehouse
          const availableWarehouses = warehouses.filter(
            (warehouse) =>
              !fields.some(
                (f, i) => f.warehouseId === warehouse.id && i !== index
              )
          )

          return (
            <div key={field.id} className="flex items-end gap-2">
              <div className="grid grid-cols-6 items-end gap-2">
                <FormField
                  control={form.control}
                  name={`inventoryRows.${index}.warehouseId`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{t("Warehouse")}</FormLabel>
                      <WarehouseCommand
                        list={availableWarehouses}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`inventoryRows.${index}.stock`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Stock")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(Number.parseInt(e.target.value, 10))
                            form.trigger("inventoryRows")
                          }}
                          onFocus={(e) => e.target.select()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`inventoryRows.${index}.lowStock`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Low stock")}</FormLabel>
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
                  name={`inventoryRows.${index}.minStock`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Min stock")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(Number.parseInt(e.target.value, 10))
                            form.trigger("inventoryRows")
                          }}
                          onFocus={(e) => e.target.select()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`inventoryRows.${index}.maxStock`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Max stock")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(Number.parseInt(e.target.value, 10))
                            form.trigger("inventoryRows")
                          }}
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
          )
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-5"
          onClick={() =>
            append({
              warehouseId: "",
              stock: 0,
              minStock: 0,
              maxStock: 0,
              lowStock: 0,
            })
          }
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("Add warehouse")}
        </Button>
      </CardContent>
    </Card>
  )
}

const CategoryTab = ({ categories }: { categories: CategorySchemaT[] }) => {
  const t = useTranslations()
  const form = useFormContext<ProductFormSchemaT>()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "categoryRows",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Category")}</CardTitle>
        <CardDescription>{t("Manage product categories")}</CardDescription>
      </CardHeader>
      <CardContent>
        {fields.map((field, index) => {
          // prevent selecting the same category
          const availableCategories = categories.filter(
            (category) =>
              !fields.some(
                (f, i) => f.categoryId === category.id && i !== index
              )
          )
          return (
            <div key={field.id} className="flex items-end gap-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name={`categoryRows.${index}.categoryId`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{t("Category")}</FormLabel>
                      <CategoryCommand
                        list={availableCategories}
                        value={field.value}
                        onChange={field.onChange}
                      />
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
          )
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-5"
          onClick={() => append({ categoryId: "" })}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("Add category")}
        </Button>
      </CardContent>
    </Card>
  )
}

export { Form as ProductForm }
