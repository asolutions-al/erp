import { InvoiceFormSchemaT } from "@/providers/invoice-form"

const calcInvoiceFormRowTotal = (row: InvoiceFormSchemaT["rows"][0]) =>
  row.quantity * row.unitPrice

const calcInvoiceFormTotal = (values: InvoiceFormSchemaT) =>
  values.rows.reduce((acc, row) => acc + calcInvoiceFormRowTotal(row), 0)

export { calcInvoiceFormRowTotal, calcInvoiceFormTotal }
