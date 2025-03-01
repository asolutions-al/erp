import { relations } from "drizzle-orm/relations";
import { organization, productInventory, product, unit, warehouse, cashRegister, invoice, customer, user, invoiceConfig, category, invitation, productCategory, orgMember, invoiceRow } from "./schema";

export const productInventoryRelations = relations(productInventory, ({one}) => ({
	organization: one(organization, {
		fields: [productInventory.orgId],
		references: [organization.id]
	}),
	product: one(product, {
		fields: [productInventory.productId],
		references: [product.id]
	}),
	unit: one(unit, {
		fields: [productInventory.unitId],
		references: [unit.id]
	}),
	warehouse: one(warehouse, {
		fields: [productInventory.warehouseId],
		references: [warehouse.id]
	}),
}));

export const organizationRelations = relations(organization, ({one, many}) => ({
	productInventories: many(productInventory),
	invoices: many(invoice),
	user: one(user, {
		fields: [organization.ownerId],
		references: [user.id]
	}),
	customers: many(customer),
	invoiceConfigs: many(invoiceConfig),
	units: many(unit),
	cashRegisters: many(cashRegister),
	categories: many(category),
	invitations: many(invitation),
	productCategories: many(productCategory),
	orgMembers: many(orgMember),
	products: many(product),
	warehouses: many(warehouse),
	invoiceRows: many(invoiceRow),
}));

export const productRelations = relations(product, ({one, many}) => ({
	productInventories: many(productInventory),
	productCategories: many(productCategory),
	organization: one(organization, {
		fields: [product.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [product.unitId],
		references: [unit.id]
	}),
	invoiceRows: many(invoiceRow),
}));

export const unitRelations = relations(unit, ({one, many}) => ({
	productInventories: many(productInventory),
	invoices: many(invoice),
	customers: many(customer),
	invoiceConfigs: many(invoiceConfig),
	organization: one(organization, {
		fields: [unit.orgId],
		references: [organization.id]
	}),
	cashRegisters: many(cashRegister),
	categories: many(category),
	invitations: many(invitation),
	productCategories: many(productCategory),
	products: many(product),
	warehouses: many(warehouse),
	invoiceRows: many(invoiceRow),
}));

export const warehouseRelations = relations(warehouse, ({one, many}) => ({
	productInventories: many(productInventory),
	invoices: many(invoice),
	organization: one(organization, {
		fields: [warehouse.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [warehouse.unitId],
		references: [unit.id]
	}),
}));

export const invoiceRelations = relations(invoice, ({one, many}) => ({
	cashRegister: one(cashRegister, {
		fields: [invoice.cashRegisterId],
		references: [cashRegister.id]
	}),
	customer: one(customer, {
		fields: [invoice.customerId],
		references: [customer.id]
	}),
	organization: one(organization, {
		fields: [invoice.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [invoice.unitId],
		references: [unit.id]
	}),
	warehouse: one(warehouse, {
		fields: [invoice.warehouseId],
		references: [warehouse.id]
	}),
	invoiceRows: many(invoiceRow),
}));

export const cashRegisterRelations = relations(cashRegister, ({one, many}) => ({
	invoices: many(invoice),
	user_closedBy: one(user, {
		fields: [cashRegister.closedBy],
		references: [user.id],
		relationName: "cashRegister_closedBy_user_id"
	}),
	user_openedBy: one(user, {
		fields: [cashRegister.openedBy],
		references: [user.id],
		relationName: "cashRegister_openedBy_user_id"
	}),
	organization: one(organization, {
		fields: [cashRegister.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [cashRegister.unitId],
		references: [unit.id]
	}),
}));

export const customerRelations = relations(customer, ({one, many}) => ({
	invoices: many(invoice),
	organization: one(organization, {
		fields: [customer.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [customer.unitId],
		references: [unit.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	organizations: many(organization),
	cashRegisters_closedBy: many(cashRegister, {
		relationName: "cashRegister_closedBy_user_id"
	}),
	cashRegisters_openedBy: many(cashRegister, {
		relationName: "cashRegister_openedBy_user_id"
	}),
	invitations: many(invitation),
	orgMembers: many(orgMember),
}));

export const invoiceConfigRelations = relations(invoiceConfig, ({one}) => ({
	organization: one(organization, {
		fields: [invoiceConfig.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [invoiceConfig.unitId],
		references: [unit.id]
	}),
}));

export const categoryRelations = relations(category, ({one, many}) => ({
	organization: one(organization, {
		fields: [category.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [category.unitId],
		references: [unit.id]
	}),
	productCategories: many(productCategory),
}));

export const invitationRelations = relations(invitation, ({one}) => ({
	organization: one(organization, {
		fields: [invitation.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [invitation.unitId],
		references: [unit.id]
	}),
	user: one(user, {
		fields: [invitation.userId],
		references: [user.id]
	}),
}));

export const productCategoryRelations = relations(productCategory, ({one}) => ({
	category: one(category, {
		fields: [productCategory.categoryId],
		references: [category.id]
	}),
	organization: one(organization, {
		fields: [productCategory.orgId],
		references: [organization.id]
	}),
	product: one(product, {
		fields: [productCategory.productId],
		references: [product.id]
	}),
	unit: one(unit, {
		fields: [productCategory.unitId],
		references: [unit.id]
	}),
}));

export const orgMemberRelations = relations(orgMember, ({one}) => ({
	organization: one(organization, {
		fields: [orgMember.orgId],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [orgMember.userId],
		references: [user.id]
	}),
}));

export const invoiceRowRelations = relations(invoiceRow, ({one}) => ({
	invoice: one(invoice, {
		fields: [invoiceRow.invoiceId],
		references: [invoice.id]
	}),
	organization: one(organization, {
		fields: [invoiceRow.orgId],
		references: [organization.id]
	}),
	product: one(product, {
		fields: [invoiceRow.productId],
		references: [product.id]
	}),
	unit: one(unit, {
		fields: [invoiceRow.unitId],
		references: [unit.id]
	}),
}));