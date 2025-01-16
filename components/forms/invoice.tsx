"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { FieldErrors, useFormContext, useWatch } from "react-hook-form"

import { ProductSchemaT } from "@/db/(inv)/schema"
import { InvoiceFormSchemaT } from "@/providers/invoice-form"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CheckoutProductCard } from "../cards/checkout-product"
import { SaleProductCard } from "../cards/sale-product"

type Props = {
  performAction: (values: InvoiceFormSchemaT) => Promise<void>
  products: ProductSchemaT[]
}

const formId: FormId = "invoice"

const Form = ({ performAction, products }: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const form = useFormContext<InvoiceFormSchemaT>()

  const onValid = async (values: InvoiceFormSchemaT) => {
    try {
      await performAction(values)
      toast.success(t("Invoice saved successfully"))
      router.back()
    } catch (error) {
      console.error("error", error)
      toast.error(t("An error occurred"))
    }
  }

  const onInvalid = (errors: FieldErrors<InvoiceFormSchemaT>) => {
    console.log("errors", errors)
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
                          productId: product.id,
                          name: product.name,
                          quantity: 1,
                          unitPrice: product.price,
                          notes: "",
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
    </>
  )
}

const Checkout = () => {
  const form = useFormContext<InvoiceFormSchemaT>()
  const rows = useWatch({ name: "rows", control: form.control })

  return (
    <div className="flex flex-col gap-2">
      {(rows || []).map((row, index) => (
        <CheckoutProductCard
          key={row.productId}
          data={row}
          onQtyChange={(qty) => {
            form.setValue(`rows.${index}.quantity`, qty)
          }}
          onRemove={() => {
            form.setValue(
              "rows",
              (rows || []).filter((_, i) => i !== index)
            )
          }}
        />
      ))}
    </div>
  )
}

export { Form as InvoiceForm }
