import { relations } from "drizzle-orm/relations";
import { organization, invoice, unit, user, customer, invitation, orgMember, product, invoiceRow } from "./schema";

export const invoiceRelations = relations(invoice, ({one, many}) => ({
	organization: one(organization, {
		fields: [invoice.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [invoice.unitId],
		references: [unit.id]
	}),
	invoiceRows: many(invoiceRow),
}));

export const organizationRelations = relations(organization, ({one, many}) => ({
	invoices: many(invoice),
	user: one(user, {
		fields: [organization.ownerId],
		references: [user.id]
	}),
	customers: many(customer),
	units: many(unit),
	invitations: many(invitation),
	orgMembers: many(orgMember),
	products: many(product),
	invoiceRows: many(invoiceRow),
}));

export const unitRelations = relations(unit, ({one, many}) => ({
	invoices: many(invoice),
	customers: many(customer),
	organization: one(organization, {
		fields: [unit.orgId],
		references: [organization.id]
	}),
	invitations: many(invitation),
	products: many(product),
	invoiceRows: many(invoiceRow),
}));

export const userRelations = relations(user, ({many}) => ({
	organizations: many(organization),
	invitations: many(invitation),
	orgMembers: many(orgMember),
}));

export const customerRelations = relations(customer, ({one}) => ({
	organization: one(organization, {
		fields: [customer.orgId],
		references: [organization.id]
	}),
	unit: one(unit, {
		fields: [customer.unitId],
		references: [unit.id]
	}),
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

export const productRelations = relations(product, ({one, many}) => ({
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