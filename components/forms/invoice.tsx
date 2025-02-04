"use client"

import { InvoiceReceipt } from "@/components/invoice-receipt"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { customerImageBucket, productImagesBucket } from "@/contants/bucket"
import { publicStorageUrl } from "@/contants/consts"
import { mapPayMethodIcon } from "@/contants/maps"
import { CustomerSchemaT, ProductSchemaT } from "@/db/app/schema"
import { cn } from "@/lib/utils"
import { payMethod, recordStatus } from "@/orm/app/schema"
import { InvoiceFormSchemaT } from "@/providers/invoice-form"
import { calcInvoiceForm } from "@/utils/calc"
import { motion } from "framer-motion"
import {
  CheckIcon,
  ChevronsUpDownIcon,
  DownloadIcon,
  MinusIcon,
  PlusIcon,
  PrinterIcon,
  XIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useState } from "react"
import { FieldErrors, useFormContext, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { Price } from "../price"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Command } from "../ui/command"
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

type SchemaT = InvoiceFormSchemaT

type Props = {
  performAction: (values: SchemaT) => Promise<void>
  products: ProductSchemaT[]
  customers: CustomerSchemaT[]
}

const formId: FormId = "invoice"

const Form = ({ performAction, products, customers }: Props) => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  const [receiptDialog, setReceiptDialog] = useState<{
    open: boolean
    data: SchemaT
  }>()

  const onValid = async (values: SchemaT) => {
    try {
      await performAction(values)
      toast.success(t("Invoice saved successfully"))
      setReceiptDialog({ open: true, data: values })
      form.reset()
    } catch (error) {
      console.error("error", error)
      toast.error(t("An error occurred"))
    }
  }

  const onInvalid = (errors: FieldErrors<SchemaT>) => {
    toast.error(t("Please fill in all required fields"))
  }

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onValid, onInvalid)}
        className="mx-auto"
        id={formId}
      >
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="space-y-3">
            <CustomerCard customers={customers} />
            <ProductsCard products={products} />
          </div>
          <div className="space-y-3">
            <PaymentCard />

            {/* <StatusCard /> */}

            <CheckoutCard />

            <Summary />
          </div>
        </div>
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
              <Button
                variant="outline"
                onClick={() => {}}
                className="mt-2 w-full sm:mt-0 sm:w-auto"
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                {t("Pdf")}
              </Button>
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

const CustomerCard = ({ customers }: { customers: CustomerSchemaT[] }) => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()
  const [customerPopOverOpen, setCustomerPopOverOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Customer")}</CardTitle>
        <CardDescription>
          {t("The person that will receive the invoice")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col">
                <Popover
                  open={customerPopOverOpen}
                  onOpenChange={setCustomerPopOverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={customerPopOverOpen}
                      className="w-60 justify-between"
                    >
                      {field.value
                        ? customers.find((li) => li.id === field.value)?.name
                        : `${t("Select customer")}...`}
                      <ChevronsUpDownIcon className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60 p-0">
                    <Command>
                      <CommandInput
                        placeholder={t("Search customer") + "..."}
                      />
                      <CommandList>
                        <CommandEmpty>{t("No customer found")}.</CommandEmpty>
                        <CommandGroup>
                          {customers.map((customer) => {
                            const {
                              idType,
                              idValue,
                              id,
                              name,
                              imageBucketPath,
                            } = customer
                            return (
                              <CommandItem
                                key={id}
                                value={name}
                                onSelect={() => {
                                  field.onChange(id)
                                  form.setValue("customer", customer)
                                  setCustomerPopOverOpen(false)
                                }}
                              >
                                <Avatar className="mr-2">
                                  {imageBucketPath ? (
                                    <AvatarImage
                                      src={`${publicStorageUrl}/${customerImageBucket}/${imageBucketPath}`}
                                      alt={name}
                                    />
                                  ) : (
                                    <AvatarFallback>
                                      {name.charAt(0)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div className="flex flex-col">
                                  <span>{name}</span>
                                  {idValue && (
                                    <span className="text-sm text-muted-foreground">
                                      {t(idType)}: {idValue}
                                    </span>
                                  )}
                                </div>
                                <CheckIcon
                                  size={16}
                                  className={cn(
                                    "ml-auto",
                                    field.value === id
                                      ? "opacity-100"
                                      : "opacity-0"
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

export const ProductsCard = ({ products }: { products: ProductSchemaT[] }) => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  const [rows, currency, exchangeRate] = useWatch({
    name: ["rows", "currency", "exchangeRate"],
    control: form.control,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Products")}</CardTitle>
        <CardDescription>{t("List of products to sell")}</CardDescription>
      </CardHeader>
      {/* TODO: remove hardcoded max height */}
      <CardContent className="grid max-h-[30rem] grid-cols-2 gap-2 overflow-y-scroll sm:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const { id, imageBucketPath, name, unit, price } = product
          const existingIdx = rows.findIndex((row) => row.productId === id)
          const existing = existingIdx !== -1 ? rows[existingIdx] : null
          const quantity = existing?.quantity || 0

          const finalPrice = price / exchangeRate

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
                onClick={() => {
                  if (existing)
                    return form.setValue(
                      `rows.${existingIdx}.quantity`,
                      existing.quantity + 1
                    )

                  form.setValue(
                    "rows",
                    [
                      ...rows,
                      {
                        ...product,
                        productId: product.id,
                        quantity: 1,
                        product,
                      },
                    ],
                    {
                      shouldDirty: true,
                    }
                  )
                }}
              >
                <figure className="relative group-hover:opacity-90">
                  {quantity > 0 && (
                    <Badge
                      className="absolute left-1.5 top-1.5"
                      variant="destructive"
                    >
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
                  <Price
                    price={finalPrice}
                    currency={currency}
                    className="justify-end"
                  />
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </CardContent>
    </Card>
  )
}

const CheckoutCard = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()
  const [rows, currency, exchangeRate] = useWatch({
    name: ["rows", "currency", "exchangeRate"],
    control: form.control,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Checkout")}</CardTitle>
        <CardDescription>
          {t("Review the invoice and proceed to checkout")}
        </CardDescription>
      </CardHeader>
      {/* TODO: remove hardcoded max height */}
      <CardContent className="max-h-96 overflow-y-scroll">
        <div className="flex flex-col gap-2">
          {(rows || []).map((row, index) => {
            const { name, price, quantity, productId } = row
            const { imageBucketPath, description, unit } = row.product || {}
            const finalPrice = price / exchangeRate

            const changeQty = (value: number) => {
              form.setValue(`rows.${index}.quantity`, value)
            }

            const remove = () => {
              form.setValue(
                "rows",
                (rows || []).filter((_, i) => i !== index)
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
                        <Price price={finalPrice} currency={currency} />
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
                          <Input
                            type="number"
                            value={quantity}
                            onChange={(e) =>
                              changeQty(parseInt(e.target.value, 10) || 1)
                            }
                            className="w-20 text-center"
                            min="1"
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
                          <XIcon />
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
  const defaultValue = useWatch({ name: "payMethod", control: form.control })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Payment")}</CardTitle>
        <CardDescription>{t("How the customer will pay")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultValue}>
          <TabsList>
            {payMethod.enumValues.map((item) => {
              const Icon = mapPayMethodIcon(item)
              const isActive = defaultValue === item
              return (
                <TabsTrigger
                  value={item}
                  key={item}
                  className="flex items-center gap-2"
                  onClick={() => form.setValue("payMethod", item)}
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
      </CardContent>
    </Card>
  )
}

const Summary = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()

  const [rows, discountType, discountValue, currency] = useWatch({
    name: ["rows", "discountType", "discountValue", "currency"],
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
            <Price price={calcs.subtotal} currency={currency} />
          </div>
          <div className="flex justify-between text-sm">
            <span>{t("Tax")}</span>
            <Price price={calcs.tax} currency={currency} />
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{t("Total")}</span>
          <Price price={calcs.total} currency={currency} className="text-lg" />
        </div>
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
        <CardDescription>{t("Current status of the invoice")}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger aria-label={t("Select status")}>
                    <SelectValue placeholder={t("Select status")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {recordStatus.enumValues.map((item) => (
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

export { Form as InvoiceForm }
