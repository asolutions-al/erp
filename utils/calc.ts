import { InvoiceFormSchemaT } from "@/providers/invoice-form"

type CalcResultT = {
  total: number
  subtotal: number
  tax: number
}

const calcInvoiceFormRow = (
  row: InvoiceFormSchemaT["rows"][0]
): CalcResultT => {
  const total = row.quantity * row.unitPrice
  return {
    total,
    subtotal: total, //TODO:
    tax: 0, // TODO:
  }
}

const calcInvoiceForm = (values: InvoiceFormSchemaT): CalcResultT => {
  const total = values.rows.reduce(
    (acc, row) => acc + calcInvoiceFormRow(row).total,
    0
  )
  return {
    total,
    subtotal: total, //TODO:
    tax: 0, // TODO:
  }
}

export { calcInvoiceForm, calcInvoiceFormRow }
