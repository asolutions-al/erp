import { taxType } from "@/orm/app/schema"
import { InvoiceFormSchemaT } from "@/providers"

type TaxTypeT = (typeof taxType.enumValues)[number]

const taxTypeToPercentage = (taxType: TaxTypeT) => {
  const MAP: Record<TaxTypeT, number> = {
    "0": 0,
    "6": 0.06,
    "10": 0.1,
    "20": 0.2,
  }
  return MAP[taxType]
}

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
  const tax = total * taxTypeToPercentage(row.taxType)
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

/**
 * @formula ((current - previous) / previous) * 100
 */
const calcGrowth = (current: number, previous: number): GrowthT => {
  const diff = current - previous
  // Avoid division by zero
  const diffPercent = (diff / (previous || 1)) * 100
  return {
    diff,
    diffPercent,
    status: diffPercent === 0 ? "equal" : diffPercent > 0 ? "up" : "down",
  }
}

export { calcGrowth, calcInvoiceForm, calcInvoiceFormRow }
