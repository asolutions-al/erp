import { invoice, organization, product, unit } from "@/orm/(inv)/schema"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

/////////////UNIT/////////////////////
const unitSchema = createSelectSchema(unit)
export type UnitSchemaT = z.infer<typeof unitSchema>
/////////////UNIT/////////////////////
const orgSchema = createSelectSchema(organization)
export type OrgSchemaT = z.infer<typeof orgSchema>
/////////////PRODUCT/////////////////////
const productSchema = createSelectSchema(product)
export type ProductSchemaT = z.infer<typeof productSchema>
/////////////INVOICE/////////////////////
const invoiceSchema = createSelectSchema(invoice)
export type InvoiceSchemaT = z.infer<typeof invoiceSchema>
