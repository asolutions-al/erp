import { pgTable, pgEnum, uuid, timestamp, text, foreignKey, doublePrecision, real } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const aal_level = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const code_challenge_method = pgEnum("code_challenge_method", ['s256', 'plain'])
export const factor_status = pgEnum("factor_status", ['unverified', 'verified'])
export const factor_type = pgEnum("factor_type", ['totp', 'webauthn', 'phone'])
export const one_time_token_type = pgEnum("one_time_token_type", ['confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token'])
export const key_status = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const key_type = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const currency = pgEnum("currency", ['ALL', 'EUR', 'USD'])
export const discountType = pgEnum("discountType", ['value', 'percentage'])
export const payMethod = pgEnum("payMethod", ['cash', 'card', 'bank', 'other'])
export const role = pgEnum("role", ['admin', 'owner', 'member'])
export const status = pgEnum("status", ['draft', 'active', 'archived'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
export const equality_op = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])


export const user = pgTable("user", {
	id: uuid("id").primaryKey().notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	email: text("email").notNull(),
	displayName: text("displayName"),
});

export const invoice = pgTable("invoice", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	unitId: uuid("unitId").notNull().references(() => unit.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	total: doublePrecision("total").notNull(),
	payMethod: payMethod("payMethod").notNull(),
	customerName: text("customerName").notNull(),
	currency: currency("currency").notNull(),
	customerId: uuid("customerId").notNull(),
	exchangeRate: doublePrecision("exchangeRate").notNull(),
	discountValue: doublePrecision("discountValue").notNull(),
	discountType: discountType("discountType").notNull(),
	notes: text("notes"),
});

export const organization = pgTable("organization", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: text("name").notNull(),
	description: text("description"),
	ownerId: uuid("ownerId").references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const unit = pgTable("unit", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	orgId: uuid("orgId").notNull().references(() => organization.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	name: text("name").notNull(),
	description: text("description"),
});

export const member = pgTable("member", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	unitId: uuid("unitId").notNull().references(() => unit.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	role: text("role").notNull(),
});

export const invitation = pgTable("invitation", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	unitId: uuid("unitId").notNull().references(() => unit.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const product = pgTable("product", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	unitId: uuid("unitId").notNull().references(() => unit.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	name: text("name").notNull(),
	price: doublePrecision("price").notNull(),
	status: status("status").notNull(),
	barcode: text("barcode"),
	description: text("description"),
	imageBucketPath: text("imageBucketPath"),
});

export const invoiceRow = pgTable("invoiceRow", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	productId: uuid("productId").notNull().references(() => product.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	name: text("name").notNull(),
	quantity: doublePrecision("quantity").notNull(),
	unitPrice: real("unitPrice").notNull(),
	notes: text("notes"),
	invoiceId: uuid("invoiceId").notNull().references(() => invoice.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	total: doublePrecision("total").notNull(),
	imageBucketPath: text("imageBucketPath"),
	barcode: text("barcode"),
	description: text("description"),
});