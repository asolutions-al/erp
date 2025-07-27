"use client"

import { InvoiceReceipt } from "@/components/invoice-receipt"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { productImagesBucket } from "@/constants/bucket"
import { publicStorageUrl } from "@/constants/consts"
import { mapPayMethodIcon } from "@/constants/maps"
import {
  CashRegisterSchemaT,
  CustomerSchemaT,
  InvoiceConfigSchemaT,
  ProductSchemaT,
  WarehouseSchemaT,
} from "@/db/app/schema"
import { cn, formatNumber } from "@/lib/utils"
import { payMethod } from "@/orm/app/schema"
import { InvoiceFormSchemaT } from "@/providers"
import { calcInvoiceForm } from "@/utils/calc"
import { checkShouldTriggerCash } from "@/utils/checks"
import { motion } from "framer-motion"
import Fuse from "fuse.js"
import {
  BanknoteIcon,
  ContactIcon,
  CreditCardIcon,
  GridIcon,
  InfoIcon,
  MinusIcon,
  PackageIcon,
  PackageSearchIcon,
  PlusCircleIcon,
  PlusIcon,
  PrinterIcon,
  SettingsIcon,
  ShoppingCartIcon,
  StarIcon,
  WarehouseIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FieldErrors, get, useFormContext, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { CustomerCommand, WarehouseCommand } from "../command"
import { CashRegisterCommand } from "../command/cashRegister"
import { CashRegisterCommand } from "../command/cashRegister"

type SchemaT = InvoiceFormSchemaT

type Props = {
  performAction: (values: SchemaT) => Promise<void>
  products: ProductSchemaT[]
  customers: CustomerSchemaT[]
  cashRegisters: CashRegisterSchemaT[]
  warehouses: WarehouseSchemaT[]
  invoiceConfig: InvoiceConfigSchemaT
}

type TabT = "info" | "config"

const formId: FormIdT = "invoice"

const Form = ({
  performAction,
  products,
  customers,
  cashRegisters,
  warehouses,
  invoiceConfig,
}: Props) => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()
  const router = useRouter()
  const { orgId, unitId } = useParams<GlobalParamsT>()
  const searchParams = useSearchParams()

  const [receiptDialog, setReceiptDialog] = useState<{
    open: boolean
    data: SchemaT
  }>()

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
      toast.success(t("Invoice saved successfully"))
      router.prefetch(`/o/${orgId}/u/${unitId}/invoice/list/today`)
      router.push(`/o/${orgId}/u/${unitId}/invoice/list/today`)
    } catch (error) {
      console.error("error", error)
      toast.error(t("An error occurred"))
    }
  }

  const onInvalid = (errors: FieldErrors<SchemaT>) => {
    const configTabError =
      get(errors, "warehouseId") || get(errors, "cashRegisterId")

    updateTabInUrl(configTabError ? "config" : "info")

    toast.error(t("Please fill in all required fields"))
  }

  return (
    <>
      <form
        id={formId}
        className="mx-auto"
        onSubmit={form.handleSubmit(onValid, onInvalid)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault()
        }}
      >
        <Tabs
          value={currentTab}
          onValueChange={(value) => updateTabInUrl(value as TabT)}
        >
          <TabsList className="grid max-w-sm grid-cols-2">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <InfoIcon size={20} />
              {t("Information")}
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <SettingsIcon size={20} />
              {t("Configuration")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="space-y-3">
                <CustomerCard customers={customers} />
                <CustomerListener customers={customers} />
                <ProductsCard products={products} />
              </div>
              <div className="space-y-3">
                <PaymentCard />

                <CheckoutCard products={products} />

                <Summary />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="config">
            <div className="grid gap-3 lg:grid-cols-2">
              <CashRegisterCard
                cashRegisters={cashRegisters}
                invoiceConfig={invoiceConfig}
              />
              <WarehouseCard
                warehouses={warehouses}
                invoiceConfig={invoiceConfig}
              />
            </div>
          </TabsContent>
        </Tabs>
      </form>

      <Dialog
        open={receiptDialog?.open}
        onOpenChange={(open) =>
          setReceiptDialog((prev) => (prev ? { ...prev, open } : prev))
        }
      >
        <DialogContent className="sm:max-w-[625px] print:border-none print:shadow-none print:[&>button]:hidden">
          <DialogHeader className="print:hidden">
            <DialogTitle>{t("Invoice receipt")}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(80vh-120px)] overflow-auto">
            <InvoiceReceipt data={receiptDialog?.data!} />
          </ScrollArea>
          <DialogFooter className="sm:justify-between print:hidden">
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              {/* <Button
                variant="outline"
                onClick={() => {}}
                className="mt-2 w-full sm:mt-0 sm:w-auto"
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                {t("Pdf")}
              </Button> */}
            </div>
            <Button onClick={() => window.print()} className="w-full sm:w-auto">
              <PrinterIcon className="mr-2 h-4 w-4" />
              {t("Print")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

type CustomerTabT = "all" | "favorite"

const CustomerCard = ({ customers }: { customers: CustomerSchemaT[] }) => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()
  const [activeTab, setActiveTab] = useState<CustomerTabT>("all")
  const [customerPopOverOpen, setCustomerPopOverOpen] = useState(false)

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
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as CustomerTabT)}
        >
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <GridIcon size={20} />
              <span className="sr-only sm:not-sr-only">{t("All")}</span>
            </TabsTrigger>
            <TabsTrigger value="favorite" className="flex items-center gap-2">
              <StarIcon size={20} />
              <span className="sr-only sm:not-sr-only">{t("Favorite")}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => {
            const tabFiltered =
              activeTab === "all"
                ? customers
                : customers.filter((customer) =>
                    field.value === customer.id ? true : customer.isFavorite
                  )

            return (
              <FormItem className="flex flex-col">
                <CustomerCommand
                  list={tabFiltered}
                  value={field.value}
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

const CustomerListener = ({ customers }: { customers: CustomerSchemaT[] }) => {
  const { control, setValue } = useFormContext<InvoiceFormSchemaT>()
  const customerId = useWatch({
    control,
    name: "customerId",
  })
  useEffect(() => {
    if (!customerId) return
    const customer = customers.find((c) => c.id === customerId)
    if (!customer) return
    setValue("customerName", customer.name)
    setValue("customerId", customer.id)
    setValue("customerIdType", customer.idType)
    setValue("customerIdValue", customer.idValue)
  }, [customers, customerId])

  return null
}

const CashRegisterCard = ({
  cashRegisters,
  invoiceConfig,
}: {
  cashRegisters: CashRegisterSchemaT[]
  invoiceConfig: InvoiceConfigSchemaT
}) => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()
  const [activeTab, setActiveTab] = useState<CustomerTabT>("all")

  const [payMethod] = useWatch({
    control: form.control,
    name: ["payMethod"],
  })

  const shouldTriggerCash = checkShouldTriggerCash({ invoiceConfig, payMethod })

  if (!shouldTriggerCash) return null

  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <BanknoteIcon size={20} />
            {t("Cash register")}
          </CardTitle>
          <CardDescription>
            {t("Where the money will be stored")}
          </CardDescription>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as CustomerTabT)}
        >
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <GridIcon size={20} />
              <span className="sr-only sm:not-sr-only">{t("All")}</span>
            </TabsTrigger>
            <TabsTrigger value="favorite" className="flex items-center gap-2">
              <StarIcon size={20} />
              <span className="sr-only sm:not-sr-only">{t("Favorite")}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="cashRegisterId"
          render={({ field }) => {
            const tabFiltered =
              activeTab === "all"
                ? cashRegisters
                : cashRegisters.filter((register) =>
                    field.value === register.id ? true : register.isFavorite
                  )

            return (
              <FormItem className="flex flex-col">
                <CashRegisterCommand
                  list={tabFiltered}
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

const WarehouseCard = ({
  warehouses,
  invoiceConfig,
}: {
  warehouses: WarehouseSchemaT[]
  invoiceConfig: InvoiceConfigSchemaT
}) => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()
  const [activeTab, setActiveTab] = useState<CustomerTabT>("all")

  if (!invoiceConfig.triggerInventoryOnInvoice) return null

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
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as CustomerTabT)}
        >
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <GridIcon size={20} />
              <span className="sr-only sm:not-sr-only">{t("All")}</span>
            </TabsTrigger>
            <TabsTrigger value="favorite" className="flex items-center gap-2">
              <StarIcon size={20} />
              <span className="sr-only sm:not-sr-only">{t("Favorite")}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="warehouseId"
          render={({ field }) => {
            const tabFiltered =
              activeTab === "all"
                ? warehouses
                : warehouses.filter((register) =>
                    field.value === register.id ? true : register.isFavorite
                  )

            return (
              <FormItem className="flex flex-col">
                <WarehouseCommand
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

type ProductTabT = "all" | "favorite"

const ProductsCard = ({ products }: { products: ProductSchemaT[] }) => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<ProductTabT>("all")

  const [rows] = useWatch({
    name: ["rows"],
    control: form.control,
  })

  const fuse = new Fuse<(typeof products)[0]>(products, {
    keys: ["name", "unit", "price", "barcode"],
    threshold: 0.3,
  })

  const seachFilteredProducts = search
    ? fuse.search(search).map((result) => result.item)
    : products

  const tabFilteredProducts =
    activeTab === "all"
      ? seachFilteredProducts
      : seachFilteredProducts.filter((product) => product.isFavorite)

  // Helper to add product to form (cart)
  const addProductToForm = (product: ProductSchemaT) => {
    const existingIdx = rows.findIndex((row) => row.productId === product.id)

    const isExisting = existingIdx !== -1

    if (isExisting) {
      form.setValue(
        `rows.${existingIdx}.quantity`,
        rows[existingIdx].quantity + 1,
        {
          shouldDirty: true,
          shouldValidate: true,
        }
      )
    } else {
      form.setValue(
        "rows",
        [
          ...rows,
          {
            ...product,
            quantity: 1,
            productId: product.id,
          },
        ],
        {
          shouldDirty: true,
          shouldValidate: true,
        }
      )
    }
  }

  // Barcode scanner support
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim() !== "") {
      // Try to find a product by barcode
      const product = products.find(
        (p) =>
          p.barcode && p.barcode.trim() !== "" && p.barcode === search.trim()
      )
      if (product) {
        addProductToForm(product)
        setSearch("") // Clear input after adding
        e.preventDefault()
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <PackageIcon size={20} />
              {t("Products")}
            </CardTitle>
            <CardDescription>{t("List of products to sell")}</CardDescription>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as ProductTabT)}
          >
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <GridIcon size={20} />
                <span className="sr-only sm:not-sr-only">{t("All")}</span>
              </TabsTrigger>
              <TabsTrigger value="favorite" className="flex items-center gap-2">
                <StarIcon size={20} />
                <span className="sr-only sm:not-sr-only">{t("Favorite")}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Input
          type="text"
          placeholder={t("Name, price, barcode") + "..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="max-w-sm"
          autoFocus
        />
      </CardHeader>
      <CardContent className="grid max-h-[29rem] grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3 xl:grid-cols-4">
        {tabFilteredProducts.length === 0 && <NoProductsFound />}

        {tabFilteredProducts.map((product) => {
          const { id, imageBucketPath, name, unit, price } = product
          const existingIdx = rows.findIndex((row) => row.productId === id)
          const existing = existingIdx !== -1 ? rows[existingIdx] : null
          const quantity = existing?.quantity || 0

          return (
            <motion.div
              key={id}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Card
                className={cn(
                  "group relative cursor-pointer select-none overflow-hidden transition-shadow duration-300 hover:shadow-md",
                  quantity > 0 && "bg-primary/5"
                )}
                onClick={() => addProductToForm(product)}
              >
                <figure className="relative group-hover:opacity-90">
                  {quantity > 0 && (
                    <Badge className="absolute left-1.5 top-1.5">
                      {quantity}
                    </Badge>
                  )}
                  <Image
                    className="aspect-square w-full object-cover"
                    src={
                      imageBucketPath
                        ? `${publicStorageUrl}/${productImagesBucket}/${imageBucketPath}`
                        : "/placeholder.svg"
                    }
                    width={200}
                    height={200}
                    alt={name}
                  />
                </figure>
                <CardContent className="!mt-0 flex h-24 flex-col justify-between p-2">
                  <div>
                    <h3 className="truncate text-lg font-semibold">{name}</h3>
                    <p className="text-sm text-muted-foreground">{t(unit)}</p>
                  </div>
                  <p className="text-right font-semibold">
                    {formatNumber(price)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </CardContent>
    </Card>
  )
}

const NoProductsFound = () => {
  const t = useTranslations()
  const { orgId, unitId } = useParams<GlobalParamsT>()
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-8 text-muted-foreground">
      <PackageSearchIcon className="mb-4 h-12 w-12" />
      <p className="mb-4">{t("No products found")}</p>
      <Link href={`/o/${orgId}/u/${unitId}/product/create`} passHref>
        <Button>
          <PlusCircleIcon />
          {t("Create new product")}
        </Button>
      </Link>
    </div>
  )
}

const NoCheckoutProducts = () => {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
      <ShoppingCartIcon className="mb-4 h-12 w-12" />
      <p className="mb-2 text-lg font-semibold">{t("Your cart is empty")}</p>
      <p>{t("Add some products to your cart to get started")}</p>
    </div>
  )
}

const CheckoutCard = ({ products }: { products: ProductSchemaT[] }) => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()
  const [rows] = useWatch({
    name: ["rows"],
    control: form.control,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCartIcon size={20} />
          {t("Checkout")}
        </CardTitle>
        <CardDescription>
          {t("Review the invoice and proceed to checkout")}
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-72 overflow-y-scroll">
        <div className="flex flex-col gap-2">
          {rows.length === 0 && <NoCheckoutProducts />}

          {(rows || []).map((row, index) => {
            const { name, price, quantity, productId } = row
            const product = products.find((p) => p.id === productId)!
            const { imageBucketPath, unit } = product

            const changeQty = (value: number) => {
              form.setValue(`rows.${index}.quantity`, value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }

            const remove = () => {
              form.setValue(
                "rows",
                (rows || []).filter((_, i) => i !== index),
                {
                  shouldDirty: true,
                  shouldValidate: true,
                }
              )
            }

            return (
              <Card className="overflow-hidden" key={productId}>
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-28 w-full flex-shrink-0 sm:w-32">
                      <Image
                        src={
                          imageBucketPath
                            ? `${publicStorageUrl}/${productImagesBucket}/${imageBucketPath}`
                            : "/placeholder.svg"
                        }
                        alt={name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="flex flex-grow flex-col justify-between p-2">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {t(unit)}
                          </p>
                        </div>
                        <p className="font-semibold">{formatNumber(price)}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={quantity === 1}
                            onClick={() => changeQty(quantity - 1)}
                            aria-label={t("Decrease quantity")}
                            type="button"
                          >
                            <MinusIcon />
                          </Button>

                          <FormField
                            control={form.control}
                            name={`rows.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem className="max-w-32">
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    placeholder="0.00"
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value))
                                    }
                                    onFocus={(e) => e.target.select()}
                                    className="text-center"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => changeQty(quantity + 1)}
                            aria-label={t("Increase quantity")}
                            type="button"
                          >
                            <PlusIcon />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => remove()}
                          className="text-destructive"
                          aria-label={t("Remove product")}
                        >
                          <XCircleIcon />
                          <span className="sr-only sm:not-sr-only">
                            {t("Remove")}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

const PaymentCard = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCardIcon size={20} />
          {t("Payment")}
        </CardTitle>
        <CardDescription>{t("How the customer will pay")}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="payMethod"
          render={({ field }) => (
            <>
              <Tabs value={field.value}>
                <TabsList>
                  {payMethod.enumValues.map((item) => {
                    const Icon = mapPayMethodIcon(item)
                    const isActive = field.value === item
                    return (
                      <TabsTrigger
                        value={item}
                        key={item}
                        className="flex items-center gap-2"
                        onClick={() =>
                          form.setValue("payMethod", item, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      >
                        <Icon size={20} />
                        <span
                          className={cn(
                            "sr-only sm:not-sr-only",
                            isActive && "not-sr-only"
                          )}
                        >
                          {t(item)}
                        </span>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </Tabs>
              <FormMessage />
            </>
          )}
        />
      </CardContent>
    </Card>
  )
}

const Summary = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  const [rows, discountType, discountValue] = useWatch({
    name: ["rows", "discountType", "discountValue"],
    control: form.control,
  })

  const calcs = calcInvoiceForm({
    rows,
    discountType,
    discountValue,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Summary")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Separator />
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{t("Subtotal")}</span>
            <p className="font-semibold">{formatNumber(calcs.subtotal)}</p>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t("Tax")}</span>
            <p className="font-semibold">{formatNumber(calcs.tax)}</p>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t("Discount")}</span>
            <p className="font-semibold">{formatNumber(calcs.discount)}</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{t("Total")}</span>
          <p className="text-lg font-semibold">{formatNumber(calcs.total)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
export { Form as InvoiceForm }

export { Form as InvoiceForm }
