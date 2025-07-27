import { relations } from "drizzle-orm/relations";
import { organization, supplier, unit, customer, cashRegister, invoiceConfig, warehouse, category, productCategory, product, user, invoice, invoiceRow, productInventoryMovement, invitation, subscription, productInventory, orgMember } from "./schema";

export const supplierRelations = relations(supplier, ({one}) => ({
	organization: one(organization, {
		fields: [supplier.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [supplier.unitId],
		references: [unit.id]
	}),
}));

export const organizationRelations = relations(organization, ({one, many}) => ({
	suppliers: many(supplier),
	customers: many(customer),
	invoiceConfigs: many(invoiceConfig),
	productCategories: many(productCategory),
	user: one(user, {
		fields: [organization.ownerId],
		references: [user.id]
	}),
	invoiceRows: many(invoiceRow),
	products: many(product),
	productInventoryMovements: many(productInventoryMovement),
	units: many(unit),
	invitations: many(invitation),
	categories: many(category),
	subscriptions: many(subscription),
	cashRegisters: many(cashRegister),
	invoices: many(invoice),
	productInventories: many(productInventory),
	warehouses: many(warehouse),
	orgMembers: many(orgMember),
}));

export const unitRelations = relations(unit, ({one, many}) => ({
	suppliers: many(supplier),
	customers: many(customer),
	invoiceConfigs: many(invoiceConfig),
	productCategories: many(productCategory),
	invoiceRows: many(invoiceRow),
	products: many(product),
	productInventoryMovements: many(productInventoryMovement),
	organization: one(organization, {
		fields: [unit.orgId],
		references: [organization.id]
	}),
	categories: many(category),
	cashRegisters: many(cashRegister),
	invoices: many(invoice),
	productInventories: many(productInventory),
	warehouses: many(warehouse),
}));

export const customerRelations = relations(customer, ({one, many}) => ({
	organization: one(organization, {
		fields: [customer.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [customer.unitId],
		references: [unit.id]
	}),
	invoiceConfigs: many(invoiceConfig),
	invoices: many(invoice),
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
	invoices: many(invoice),
}));

export const warehouseRelations = relations(warehouse, ({one, many}) => ({
	invoiceConfigs: many(invoiceConfig),
	productInventoryMovements: many(productInventoryMovement),
	invoices: many(invoice),
	productInventories: many(productInventory),
	organization: one(organization, {
		fields: [warehouse.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [warehouse.unitId],
		references: [unit.id]
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

export const categoryRelations = relations(category, ({one, many}) => ({
	productCategories: many(productCategory),
	organization: one(organization, {
		fields: [category.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [category.unitId],
		references: [unit.id]
	}),
}));

export const productRelations = relations(product, ({one, many}) => ({
	productCategories: many(productCategory),
	invoiceRows: many(invoiceRow),
	organization: one(organization, {
		fields: [product.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [product.unitId],
		references: [unit.id]
	}),
	productInventoryMovements: many(productInventoryMovement),
	productInventories: many(productInventory),
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
	invoices_createdBy: many(invoice, {
		relationName: "invoice_createdBy_user_id"
	}),
	invoices_updatedBy: many(invoice, {
		relationName: "invoice_updatedBy_user_id"
	}),
	orgMembers: many(orgMember),
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
	user_createdBy: one(user, {
		fields: [invoice.createdBy],
		references: [user.id],
		relationName: "invoice_createdBy_user_id"
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
	user_updatedBy: one(user, {
		fields: [invoice.updatedBy],
		references: [user.id],
		relationName: "invoice_updatedBy_user_id"
	}),
	warehouse: one(warehouse, {
		fields: [invoice.warehouseId],
		references: [warehouse.id]
	}),
}));

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

export const invitationRelations = relations(invitation, ({one}) => ({
	user: one(user, {
		fields: [invitation.invitedBy],
		references: [user.id]
	}),
	organization: one(organization, {
		fields: [invitation.orgId],
		references: [organization.id]
	}),
}));

export const subscriptionRelations = relations(subscription, ({one}) => ({
	organization: one(organization, {
		fields: [subscription.orgId],
		references: [organization.id]
	}),
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