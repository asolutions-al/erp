import {
  cashRegister,
  customer,
  invoice,
  invoiceConfig,
  invoiceRow,
  organization,
  orgMember,
  product,
  unit,
  user,
  warehouse,
} from "@/orm/app/schema"
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
/////////////CUSTOMER/////////////////////
const customerSchema = createSelectSchema(customer)
export type CustomerSchemaT = z.infer<typeof customerSchema>
/////////////INVOICE/////////////////////
const invoiceSchema = createSelectSchema(invoice)
export type InvoiceSchemaT = z.infer<typeof invoiceSchema>
/////////////INVOICE ROW/////////////////////
const invoiceRowSchema = createSelectSchema(invoiceRow)
export type InvoiceRowSchemaT = z.infer<typeof invoiceRowSchema>
/////////////ORG MEMBER/////////////////////
const orgMemberSchema = createSelectSchema(orgMember)
export type OrgMemberSchemaT = z.infer<typeof orgMemberSchema>
/////////////USER/////////////////////
const userSchema = createSelectSchema(user)
export type UserSchemaT = z.infer<typeof userSchema>
/////////////CASH REGISTER/////////////////////
const cashRegisterSchema = createSelectSchema(cashRegister)
export type CashRegisterSchemaT = z.infer<typeof cashRegisterSchema>
/////////////CASH REGISTER/////////////////////
const invoiceConfigSchema = createSelectSchema(invoiceConfig)
export type InvoiceConfigSchemaT = z.infer<typeof invoiceConfigSchema>
/////////////WAREHOUSE/////////////////////
const warehouseSchema = createSelectSchema(warehouse)
export type WarehouseSchemaT = z.infer<typeof warehouseSchema>
