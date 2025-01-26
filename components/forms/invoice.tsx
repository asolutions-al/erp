"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { FieldErrors, useFormContext, useWatch } from "react-hook-form"

import { SaleProductCard } from "@/components/cards"
import { InvoiceReceipt } from "@/components/invoice-receipt"
import { PayMethodTabs } from "@/components/tabs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { productImagesBucket } from "@/contants/bucket"
import { publicStorageUrl } from "@/contants/consts"
import { CustomerSchemaT, ProductSchemaT } from "@/db/app/schema"
import { InvoiceFormSchemaT } from "@/providers/invoice-form"
import {
  CheckIcon,
  ChevronsUpDownIcon,
  MinusIcon,
  PlusIcon,
  XIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import { Command } from "../ui/command"
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

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
    console.error("errors", errors)
    toast.error(t("Please fill in all required fields"))
  }

  const [customerPopOverOpen, setCustomerPopOverOpen] = useState(false)

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onValid, onInvalid)}
        className="mx-auto"
        id={formId}
      >
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="space-y-3">
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
                  render={({ field, fieldState }) => {
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t("Customer")}</FormLabel>
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
                                ? customers.find((li) => li.id === field.value)
                                    ?.name
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
                                <CommandEmpty>
                                  {t("No customer found")}.
                                </CommandEmpty>
                                <CommandGroup>
                                  {customers.map((li) => (
                                    <CommandItem
                                      key={li.id}
                                      value={li.id}
                                      onSelect={(currentValue) => {
                                        field.onChange(currentValue)
                                        form.setValue("customerName", li.name)
                                        setCustomerPopOverOpen(false)
                                      }}
                                    >
                                      {li.name}
                                      <CheckIcon
                                        className={cn(
                                          "ml-auto",
                                          field.value === li.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
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
            <Card>
              <CardHeader>
                <CardTitle>{t("Products")}</CardTitle>
                <CardDescription>
                  {t("List of products to sell")}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <SaleProductCard
                    key={product.id}
                    data={product}
                    onSelect={() => {
                      const existingRows = form.getValues().rows || []

                      const existingProductIdx = existingRows.findIndex(
                        (row) => row.productId === product.id
                      )

                      const existingProduct = existingRows[existingProductIdx]

                      if (existingProduct) {
                        form.setValue(
                          `rows.${existingProductIdx}.quantity`,
                          existingProduct.quantity + 1
                        )
                        return
                      }

                      form.setValue("rows", [
                        ...(form.getValues().rows || []),
                        {
                          ...product,
                          productId: product.id,
                          quantity: 1,
                          unitPrice: product.price,
                        },
                      ])
                    }}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>{t("Payment")}</CardTitle>
                <CardDescription>{t("Method of payment")}</CardDescription>
              </CardHeader>
              <CardContent>
                <PayMethodTabs defaultValue="cash" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Checkout")}</CardTitle>
                <CardDescription>
                  {t("Review the invoice and proceed to checkout")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Checkout />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      <Dialog
        open={receiptDialog?.open}
        onOpenChange={(open) =>
          setReceiptDialog((prev) => (prev ? { ...prev, open } : prev))
        }
      >
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{t("Invoice receipt")}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh] overflow-auto">
            <InvoiceReceipt data={receiptDialog?.data!} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}

const Checkout = () => {
  const t = useTranslations()
  const form = useFormContext<SchemaT>()
  const rows = useWatch({ name: "rows", control: form.control })

  return (
    <div className="flex flex-col gap-2">
      {(rows || []).map((row, index) => {
        const {
          name,
          unitPrice,
          quantity,
          imageBucketPath,
          productId,
          description,
        } = row

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
                <div className="relative h-32 w-full flex-shrink-0 sm:w-32">
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
                        {description}
                      </p>
                    </div>
                    <p className="text-lg font-bold">${unitPrice}</p>
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
                      size="sm"
                      onClick={() => remove()}
                      className="text-destructive"
                      aria-label={t("Remove product")}
                    >
                      <XIcon className="mr-2 h-4 w-4" />
                      {t("Remove")}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export { Form as InvoiceForm }
