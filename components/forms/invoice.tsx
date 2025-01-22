"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { FieldErrors, useFormContext, useWatch } from "react-hook-form"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { publicStorageUrl } from "@/contants/consts"
import { ProductSchemaT } from "@/db/app/schema"
import { InvoiceFormSchemaT } from "@/providers/invoice-form"
import { MinusIcon, PlusIcon, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import { SaleProductCard } from "../cards/sale-product"
import { InvoiceReceipt } from "../invoice-receipt"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

type Props = {
  performAction: (values: InvoiceFormSchemaT) => Promise<void>
  products: ProductSchemaT[]
}

const formId: FormId = "invoice"

const Form = ({ performAction, products }: Props) => {
  const t = useTranslations()
  const form = useFormContext<InvoiceFormSchemaT>()

  const [receiptDialog, setReceiptDialog] = useState<{
    open: boolean
    data: InvoiceFormSchemaT
  }>()

  const onValid = async (values: InvoiceFormSchemaT) => {
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

  const onInvalid = (errors: FieldErrors<InvoiceFormSchemaT>) => {
    console.error("errors", errors)
    toast.error(t("Please fill in all required fields"))
  }

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onValid, onInvalid)}
        className="mx-auto"
        id={formId}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t("Details")}</CardTitle>
                <CardDescription>
                  {t("Information about the invoice")}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
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
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t("Checkout")}</CardTitle>
                <CardDescription>
                  {t("Payment, customer and other details")}
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
  const form = useFormContext<InvoiceFormSchemaT>()
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
                <div className="relative h-32 w-full sm:w-32 flex-shrink-0">
                  <Image
                    src={
                      imageBucketPath
                        ? `${publicStorageUrl}/productImages/${imageBucketPath}`
                        : "/placeholder.svg"
                    }
                    alt={name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="flex-grow p-2 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                    <p className="text-lg font-bold">${unitPrice}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
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
                      <XIcon className="h-4 w-4 mr-2" />
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
