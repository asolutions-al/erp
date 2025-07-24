import { InvoiceFormSchemaT } from "@/providers"

type CalcResultT = {
  total: number
  subtotal: number
  tax: number
  discount: number
}

const calcInvoiceFormRow = (
  row: InvoiceFormSchemaT["rows"][0]
): CalcResultT => {
  const total = row.quantity * row.price
  const tax = (total * row.taxPercentage) / 100
  const subtotal = total - tax

  return {
    total,
    subtotal,
    tax,
    discount: 0, // row discount is not implemented
  }
}

const calcInvoiceForm = (
  values: Pick<InvoiceFormSchemaT, "rows" | "discountType" | "discountValue">
): CalcResultT => {
  const productsTotal = values.rows.reduce(
    (acc, row) => acc + calcInvoiceFormRow(row).total,
    0
  )
  const tax = values.rows.reduce(
    (acc, row) => acc + calcInvoiceFormRow(row).tax,
    0
  )

  const discount =
    values.discountType === "value"
      ? values.discountValue
      : productsTotal * values.discountValue

  const subtotal = productsTotal - tax
  const total = productsTotal - discount

  return {
    total,
    subtotal,
    tax,
    discount,
  }
}

export { calcInvoiceForm, calcInvoiceFormRow }
