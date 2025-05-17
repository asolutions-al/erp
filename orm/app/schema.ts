import { pgTable, foreignKey, uuid, timestamp, doublePrecision, boolean, text, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const discountType = pgEnum("discountType", ['value', 'percentage'])
export const entityStatus = pgEnum("entityStatus", ['draft', 'active', 'archived'])
export const idType = pgEnum("idType", ['tin', 'id'])
export const payMethod = pgEnum("payMethod", ['cash', 'card', 'bank', 'other'])
export const productUnit = pgEnum("productUnit", ['E49', 'GRM', 'HUR', 'KGM', 'KMT', 'KWH', 'LM', 'LTR', 'M4', 'MTK', 'MTQ', 'PR', 'SAN', 'WM', 'XAM', 'XAV', 'XBE', 'XPP'])
export const reason = pgEnum("reason", ['SALE', 'PURCHASE', 'ADJUSMENT'])
export const recordStatus = pgEnum("recordStatus", ['draft', 'completed'])
export const role = pgEnum("role", ['admin', 'owner', 'member'])
export const taxType = pgEnum("taxType", ['0', '6', '10', '20'])


export const productInventoryMovement = pgTable("productInventoryMovement", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	productId: uuid().notNull(),
	orgId: uuid().notNull(),
	unitId: uuid().notNull(),
	warehouseId: uuid().notNull(),
	amount: doublePrecision().notNull(),
	reason: reason().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "productInventory_duplicate_orgId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [product.id],
			name: "productInventory_duplicate_productId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [unit.id],
			name: "productInventory_duplicate_unitId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.warehouseId],
			foreignColumns: [warehouse.id],
			name: "productInventory_duplicate_warehouseId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const productInventory = pgTable("productInventory", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	productId: uuid().notNull(),
	orgId: uuid().notNull(),
	unitId: uuid().notNull(),
	warehouseId: uuid().notNull(),
	stock: doublePrecision().notNull(),
	minStock: doublePrecision().notNull(),
	maxStock: doublePrecision().notNull(),
	lowStock: doublePrecision().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "productInventory_orgId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [product.id],
			name: "productInventory_productId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [unit.id],
			name: "productInventory_unitId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.warehouseId],
			foreignColumns: [warehouse.id],
			name: "productInventory_warehouseId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const invoiceConfig = pgTable("invoiceConfig", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	orgId: uuid().notNull(),
	unitId: uuid().notNull(),
	payMethod: payMethod().notNull(),
	triggerCashOnInvoice: boolean().notNull(),
	triggerInventoryOnInvoice: boolean().notNull(),
	warehouseId: uuid(),
	customerId: uuid(),
	cashRegisterId: uuid(),
}, (table) => [
	foreignKey({
			columns: [table.cashRegisterId],
			foreignColumns: [cashRegister.id],
			name: "invoiceConfig_cashRegisterId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [customer.id],
			name: "invoiceConfig_customerId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "invoiceConfig_orgId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [unit.id],
			name: "invoiceConfig_unitId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.warehouseId],
			foreignColumns: [warehouse.id],
			name: "invoiceConfig_warehouseId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const category = pgTable("category", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	orgId: uuid().notNull(),
	unitId: uuid().notNull(),
	name: text().notNull(),
	forProduct: boolean().notNull(),
	forCustomer: boolean().notNull(),
	status: entityStatus().notNull(),
	isFavorite: boolean().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "category_orgId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [unit.id],
			name: "category_unitId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const organization = pgTable("organization", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: text().notNull(),
	description: text(),
	ownerId: uuid().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "organization_ownerId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const invoiceRow = pgTable("invoiceRow", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	productId: uuid().notNull(),
	name: text().notNull(),
	quantity: doublePrecision().notNull(),
	invoiceId: uuid().notNull(),
	total: doublePrecision().notNull(),
	unitId: uuid().notNull(),
	orgId: uuid().notNull(),
	subtotal: doublePrecision().notNull(),
	price: doublePrecision().notNull(),
	tax: doublePrecision().notNull(),
	taxType: taxType().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.invoiceId],
			foreignColumns: [invoice.id],
			name: "invoiceRow_invoiceId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "invoiceRow_orgId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [product.id],
			name: "invoiceRow_productId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [unit.id],
			name: "invoiceRow_unitId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const unit = pgTable("unit", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	orgId: uuid().notNull(),
	name: text().notNull(),
	description: text(),
}, (table) => [
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "unit_orgId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const product = pgTable("product", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	unitId: uuid().notNull(),
	name: text().notNull(),
	price: doublePrecision().notNull(),
	status: entityStatus().notNull(),
	barcode: text(),
	description: text(),
	imageBucketPath: text(),
	orgId: uuid().notNull(),
	unit: productUnit().notNull(),
	taxType: taxType().notNull(),
	isFavorite: boolean().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "product_orgId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [unit.id],
			name: "product_unitId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const user = pgTable("user", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	email: text().notNull(),
	displayName: text(),
	defaultOrgId: uuid(),
	deleted: boolean(),
	deletedAt: timestamp({ withTimezone: true, mode: 'string' }),
});

export const customer = pgTable("customer", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	unitId: uuid().notNull(),
	name: text().notNull(),
	status: entityStatus().notNull(),
	description: text(),
	imageBucketPath: text(),
	idType: idType().notNull(),
	email: text(),
	address: text(),
	city: text(),
	idValue: text(),
	orgId: uuid().notNull(),
	isFavorite: boolean().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "customer_orgId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [unit.id],
			name: "customer_unitId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const invitation = pgTable("invitation", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	unitId: uuid().notNull(),
	userId: uuid().notNull(),
	orgId: uuid().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "invitation_orgId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [unit.id],
			name: "invitation_unitId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "invitation_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const cashRegister = pgTable("cashRegister", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	unitId: uuid().notNull(),
	orgId: uuid().notNull(),
	name: text().notNull(),
	balance: doublePrecision().notNull(),
	isOpen: boolean().notNull(),
	openedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	closedAt: timestamp({ withTimezone: true, mode: 'string' }),
	openingBalance: doublePrecision().notNull(),
	closingBalanace: doublePrecision(),
	openedBy: uuid().notNull(),
	closedBy: uuid(),
	status: entityStatus().notNull(),
	isFavorite: boolean().default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.closedBy],
			foreignColumns: [user.id],
			name: "cash_closedBy_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.openedBy],
			foreignColumns: [user.id],
			name: "cash_openedBy_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "cash_orgId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [unit.id],
			name: "cash_unitId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const invoice = pgTable("invoice", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	unitId: uuid().notNull(),
	total: doublePrecision().notNull(),
	payMethod: payMethod().notNull(),
	discountValue: doublePrecision().notNull(),
	discountType: discountType().notNull(),
	notes: text(),
	status: recordStatus().notNull(),
	orgId: uuid().notNull(),
	subtotal: doublePrecision().notNull(),
	tax: doublePrecision().notNull(),
	cashRegisterId: uuid(),
	customerId: uuid().notNull(),
	customerName: text().notNull(),
	customerIdType: idType().notNull(),
	customerIdValue: text(),
	warehouseId: uuid().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.cashRegisterId],
			foreignColumns: [cashRegister.id],
			name: "invoice_cashRegisterId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [customer.id],
			name: "invoice_customerId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "invoice_orgId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [unit.id],
			name: "invoice_unitId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.warehouseId],
			foreignColumns: [warehouse.id],
			name: "invoice_warehouseId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const orgMember = pgTable("orgMember", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	orgId: uuid().notNull(),
	userId: uuid().notNull(),
	role: role().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "orgMember_orgId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "orgMember_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const productCategory = pgTable("productCategory", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	categoryId: uuid().notNull(),
	productId: uuid().notNull(),
	orgId: uuid().notNull(),
	unitId: uuid().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [category.id],
			name: "productCategory_categoryId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "productCategory_orgId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [product.id],
			name: "productCategory_productId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [unit.id],
			name: "productCategory_unitId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const warehouse = pgTable("warehouse", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	orgId: uuid().notNull(),
	unitId: uuid().notNull(),
	name: text().notNull(),
	city: text(),
	address: text(),
	status: entityStatus().notNull(),
	isFavorite: boolean().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orgId],
			foreignColumns: [organization.id],
			name: "warehouse_orgId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [unit.id],
			name: "warehouse_unitId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);
