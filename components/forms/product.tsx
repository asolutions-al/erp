"use client"

import { ImageBucketUploader } from "@/components/image-bucket-uploader"
import { Button } from "@/components/ui/button"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { CategorySchemaT, WarehouseSchemaT } from "@/db/app/schema"
import { productUnit } from "@/orm/app/schema"
import type { ProductFormSchemaT } from "@/providers"
import {
  BriefcaseBusinessIcon,
  CircleDashedIcon,
  DollarSignIcon,
  ImageIcon,
  InfoIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
  WarehouseIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { CategoryCommand, UnitCommand, WarehouseCommand } from "../command"
import { EntityStatusSelect } from "../select"

type SchemaT = ProductFormSchemaT

type Props = {
  performAction: (values: SchemaT) => Promise<void>
  warehouses: WarehouseSchemaT[]
  categories: CategorySchemaT[]

  flow?: {
    redirectAfterAction?: boolean
  }
}

type TabT = "info" | "inv" | "cat" | "config"

const formId: FormIdT = "product"

const Form = ({
  performAction,
  warehouses,
  categories,
  flow = { redirectAfterAction: true },
}: Props) => {
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
      toast.success(t("Product saved successfully"))
      if (flow.redirectAfterAction) {
        router.prefetch(`/o/${orgId}/u/${unitId}/product/list/${values.status}`)
        router.push(`/o/${orgId}/u/${unitId}/product/list/${values.status}`)
      }
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
          <TabsList className="grid max-w-xl grid-cols-4">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <InfoIcon size={20} />
              <span className="sr-only sm:not-sr-only">{t("Information")}</span>
            </TabsTrigger>
            <TabsTrigger value="inv" className="flex items-center gap-2">
              <WarehouseIcon size={20} />
              <span className="sr-only sm:not-sr-only">{t("Inventory")}</span>
            </TabsTrigger>
            <TabsTrigger value="cat" className="flex items-center gap-2">
              <BriefcaseBusinessIcon size={20} />
              <span className="sr-only sm:not-sr-only">{t("Category")}</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <SettingsIcon size={20} />
              <span className="sr-only sm:not-sr-only">
                {t("Configuration")}
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inv">
            <InventoryTab warehouses={warehouses} />
          </TabsContent>
          <TabsContent value="cat">
            <CategoryTab categories={categories} />
          </TabsContent>
          <TabsContent
            value="info"
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
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon size={20} />
          {t("Images")}
        </CardTitle>
        <CardDescription>
          {t("Upload and manage product image")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="imageBucketPath"
          render={({ field }) => (
            <ImageBucketUploader
              bucket="productImages"
              path={field.value}
              setPath={field.onChange}
            />
          )}
        />
      </CardContent>
    </Card>
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
        <CardTitle className="flex items-center gap-2">
          <InfoIcon size={20} />
          {t("Information")}
        </CardTitle>
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
                <Input placeholder="Pizza" {...field} autoFocus />
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
                <UnitCommand value={field.value} onChange={field.onChange} />
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
        <CardTitle className="flex items-center gap-2">
          <DollarSignIcon size={20} />
          {t("Pricing")}
        </CardTitle>
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
        <CardTitle className="flex items-center gap-2">
          <InfoIcon size={20} />
          {t("Additional")}
        </CardTitle>
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
        <CardTitle className="flex items-center gap-2">
          <CircleDashedIcon size={20} />
          {t("Status")}
        </CardTitle>
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
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon size={20} />
          {t("Settings")}
        </CardTitle>
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("Inventory")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("Manage product inventory across warehouses")}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={fields.length >= warehouses.length}
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
      </div>

      {fields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <WarehouseIcon className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-center text-sm text-muted-foreground">
              {t("No warehouses added yet")}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              disabled={warehouses.length === 0}
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
              {t("Add first warehouse")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {fields.map((field, index) => {
            // prevent selecting the same warehouse
            const availableWarehouses = warehouses.filter(
              (warehouse) =>
                !fields.some(
                  (f, i) => f.warehouseId === warehouse.id && i !== index
                )
            )

            return (
              <Card key={field.id} className="relative">
                <CardContent className="p-4">
                  <div className="absolute right-3 top-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Responsive layout using CSS only */}
                  <div className="space-y-4 pr-12 sm:grid sm:grid-cols-6 sm:gap-4 sm:space-y-0">
                    <FormField
                      control={form.control}
                      name={`inventoryRows.${index}.warehouseId`}
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
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
                                field.onChange(
                                  Number.parseInt(e.target.value, 10)
                                )
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
                                field.onChange(
                                  Number.parseInt(e.target.value, 10)
                                )
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
                                field.onChange(
                                  Number.parseInt(e.target.value, 10)
                                )
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
                                field.onChange(
                                  Number.parseInt(e.target.value, 10)
                                )
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
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("Category")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("Manage product categories")}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={fields.length >= categories.length}
          onClick={() => append({ categoryId: "" })}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("Add category")}
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <BriefcaseBusinessIcon className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-center text-sm text-muted-foreground">
              {t("No categories added yet")}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              disabled={categories.length === 0}
              onClick={() => append({ categoryId: "" })}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              {t("Add first category")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {fields.map((field, index) => {
            // prevent selecting the same category
            const availableCategories = categories.filter(
              (category) =>
                !fields.some(
                  (f, i) => f.categoryId === category.id && i !== index
                )
            )

            return (
              <Card key={field.id} className="relative">
                <CardContent className="p-4">
                  <div className="absolute right-3 top-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="pr-12">
                    <FormField
                      control={form.control}
                      name={`categoryRows.${index}.categoryId`}
                      render={({ field }) => (
                        <FormItem>
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
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { Form as ProductForm }
