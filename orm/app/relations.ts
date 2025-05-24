import { relations } from "drizzle-orm/relations";
import { organization, productInventoryMovement, product, unit, warehouse, invoice, invoiceRow, cashRegister, invoiceConfig, customer, category, user, productInventory, invitation, orgMember, productCategory } from "./schema";

export const productInventoryMovementRelations = relations(productInventoryMovement, ({one}) => ({
	organization: one(organization, {
		fields: [productInventoryMovement.orgId],
		references: [organization.id]
	}),
	product: one(product, {
		fields: [productInventoryMovement.productId],
		references: [product.id]
	}),
	unit: one(unit, {
		fields: [productInventoryMovement.unitId],
		references: [unit.id]
	}),
	warehouse: one(warehouse, {
		fields: [productInventoryMovement.warehouseId],
		references: [warehouse.id]
	}),
}));

export const organizationRelations = relations(organization, ({one, many}) => ({
	productInventoryMovements: many(productInventoryMovement),
	invoiceRows: many(invoiceRow),
	invoiceConfigs: many(invoiceConfig),
	categories: many(category),
	user: one(user, {
		fields: [organization.ownerId],
		references: [user.id]
	}),
	productInventories: many(productInventory),
	invitations: many(invitation),
	units: many(unit),
	products: many(product),
	customers: many(customer),
	invoices: many(invoice),
	cashRegisters: many(cashRegister),
	orgMembers: many(orgMember),
	productCategories: many(productCategory),
	warehouses: many(warehouse),
}));

export const productRelations = relations(product, ({one, many}) => ({
	productInventoryMovements: many(productInventoryMovement),
	invoiceRows: many(invoiceRow),
	productInventories: many(productInventory),
	organization: one(organization, {
		fields: [product.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [product.unitId],
		references: [unit.id]
	}),
	productCategories: many(productCategory),
}));

export const unitRelations = relations(unit, ({one, many}) => ({
	productInventoryMovements: many(productInventoryMovement),
	invoiceRows: many(invoiceRow),
	invoiceConfigs: many(invoiceConfig),
	categories: many(category),
	productInventories: many(productInventory),
	organization: one(organization, {
		fields: [unit.orgId],
		references: [organization.id]
	}),
	products: many(product),
	customers: many(customer),
	invoices: many(invoice),
	cashRegisters: many(cashRegister),
	productCategories: many(productCategory),
	warehouses: many(warehouse),
}));

export const warehouseRelations = relations(warehouse, ({one, many}) => ({
	productInventoryMovements: many(productInventoryMovement),
	invoiceConfigs: many(invoiceConfig),
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

export const invoiceRelations = relations(invoice, ({one, many}) => ({
	invoiceRows: many(invoiceRow),
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
}));

export const invoiceConfigRelations = relations(invoiceConfig, ({one}) => ({
	cashRegister: one(cashRegister, {
		fields: [invoiceConfig.cashRegisterId],
		references: [cashRegister.id]
	}),
	customer: one(customer, {
		fields: [invoiceConfig.customerId],
		references: [customer.id]
	}),
	organization: one(organization, {
		fields: [invoiceConfig.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [invoiceConfig.unitId],
		references: [unit.id]
	}),
	warehouse: one(warehouse, {
		fields: [invoiceConfig.warehouseId],
		references: [warehouse.id]
	}),
}));

export const cashRegisterRelations = relations(cashRegister, ({one, many}) => ({
	invoiceConfigs: many(invoiceConfig),
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
	invoiceConfigs: many(invoiceConfig),
	organization: one(organization, {
		fields: [customer.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [customer.unitId],
		references: [unit.id]
	}),
	invoices: many(invoice),
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

export const userRelations = relations(user, ({many}) => ({
	organizations: many(organization),
	invitations: many(invitation),
	cashRegisters_closedBy: many(cashRegister, {
		relationName: "cashRegister_closedBy_user_id"
	}),
	cashRegisters_openedBy: many(cashRegister, {
		relationName: "cashRegister_openedBy_user_id"
	}),
	orgMembers: many(orgMember),
}));

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

export const invitationRelations = relations(invitation, ({one}) => ({
	organization: one(organization, {
		fields: [invitation.orgId],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [invitation.userId],
		references: [user.id]
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