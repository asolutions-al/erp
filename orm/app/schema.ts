import { CustomerSchemaT, ProductSchemaT } from "@/db/app/schema"
import {
  boolean,
  doublePrecision,
  foreignKey,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

export const idType = pgEnum("IdType", ["tin", "id"])
export const currency = pgEnum("currency", ["all", "eur", "usd"])
export const discountType = pgEnum("discountType", ["value", "percentage"])
export const payMethod = pgEnum("payMethod", ["cash", "card", "bank", "other"])
export const productUnit = pgEnum("productUnit", [
  "E49",
  "GRM",
  "HUR",
  "KGM",
  "KMT",
  "KWH",
  "LM",
  "LTR",
  "M4",
  "MTK",
  "MTQ",
  "PR",
  "SAN",
  "WM",
  "XAM",
  "XAV",
  "XBE",
  "XPP",
])
export const recordStatus = pgEnum("recordStatus", ["draft", "completed"])
export const role = pgEnum("role", ["admin", "owner", "member"])
export const status = pgEnum("status", ["draft", "active", "archived"])
export const taxType = pgEnum("taxType", ["0", "6", "10", "20"])

export const user = pgTable("user", {
  id: uuid().primaryKey().notNull(),
  createdAt: timestamp({ withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  email: text().notNull(),
  displayName: text(),
  defaultOrgId: uuid().notNull(),
  deleted: boolean(),
  deletedAt: timestamp({ withTimezone: true, mode: "string" }),
})

export const invoice = pgTable(
  "invoice",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    unitId: uuid().notNull(),
    total: doublePrecision().notNull(),
    payMethod: payMethod().notNull(),
    currency: currency().notNull(),
    customerId: uuid().notNull(),
    exchangeRate: doublePrecision().notNull(),
    discountValue: doublePrecision().notNull(),
    discountType: discountType().notNull(),
    notes: text(),
    status: recordStatus().notNull(),
    orgId: uuid().notNull(),
    subtotal: doublePrecision().notNull(),
    tax: doublePrecision().notNull(),
    date: timestamp({ withTimezone: true, mode: "string" }),
    customer: jsonb().notNull().$type<CustomerSchemaT>(),
  },
  (table) => [
    foreignKey({
      columns: [table.orgId],
      foreignColumns: [organization.id],
      name: "invoice_orgId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.unitId],
      foreignColumns: [unit.id],
      name: "invoice_unitId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
)

export const organization = pgTable(
  "organization",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    name: text().notNull(),
    description: text(),
    ownerId: uuid().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.ownerId],
      foreignColumns: [user.id],
      name: "organization_ownerId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
)

export const customer = pgTable(
  "customer",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    unitId: uuid().notNull(),
    name: text().notNull(),
    status: status().notNull(),
    description: text(),
    imageBucketPath: text(),
    idType: idType().notNull(),
    email: text(),
    address: text(),
    city: text(),
    idValue: text(),
    orgId: uuid().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.orgId],
      foreignColumns: [organization.id],
      name: "customer_orgId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.unitId],
      foreignColumns: [unit.id],
      name: "customer_unitId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
)

export const unit = pgTable(
  "unit",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    orgId: uuid().notNull(),
    name: text().notNull(),
    description: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.orgId],
      foreignColumns: [organization.id],
      name: "unit_orgId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
)

export const invitation = pgTable(
  "invitation",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    unitId: uuid().notNull(),
    userId: uuid().notNull(),
    orgId: uuid().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.orgId],
      foreignColumns: [organization.id],
      name: "invitation_orgId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.unitId],
      foreignColumns: [unit.id],
      name: "invitation_unitId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "invitation_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
)

export const unitMember = pgTable(
  "unitMember",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    unitId: uuid().notNull(),
    userId: uuid().notNull(),
    role: role().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.unitId],
      foreignColumns: [unit.id],
      name: "unitMember_unitId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "unitMember_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
)

export const orgMember = pgTable(
  "orgMember",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    orgId: uuid().notNull(),
    userId: uuid().notNull(),
    role: role().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.orgId],
      foreignColumns: [organization.id],
      name: "orgMember_orgId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "orgMember_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
)

export const product = pgTable(
  "product",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    unitId: uuid().notNull(),
    name: text().notNull(),
    price: doublePrecision().notNull(),
    status: status().notNull(),
    barcode: text(),
    description: text(),
    imageBucketPath: text(),
    orgId: uuid().notNull(),
    unit: productUnit().notNull(),
    taxType: taxType().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.orgId],
      foreignColumns: [organization.id],
      name: "product_orgId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.unitId],
      foreignColumns: [unit.id],
      name: "product_unitId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
)

export const invoiceRow = pgTable(
  "invoiceRow",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    productId: uuid().notNull(),
    name: text().notNull(),
    quantity: doublePrecision().notNull(),
    invoiceId: uuid().notNull(),
    total: doublePrecision().notNull(),
    unitId: uuid().notNull(),
    orgId: uuid().notNull(),
    subtotal: doublePrecision().notNull(),
    product: jsonb().notNull().$type<ProductSchemaT>(),
    price: doublePrecision().notNull(),
    tax: doublePrecision().notNull(),
    taxType: taxType().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.invoiceId],
      foreignColumns: [invoice.id],
      name: "invoiceRow_invoiceId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.orgId],
      foreignColumns: [organization.id],
      name: "invoiceRow_orgId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [product.id],
      name: "invoiceRow_productId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.unitId],
      foreignColumns: [unit.id],
      name: "invoiceRow_unitId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
)
