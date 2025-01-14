import { relations } from "drizzle-orm/relations";
import { organization, unit, member, user, invitation, product } from "./schema";

export const unitRelations = relations(unit, ({one, many}) => ({
	organization: one(organization, {
		fields: [unit.orgId],
		references: [organization.id]
	}),
	members: many(member),
	invitations: many(invitation),
	products: many(product),
}));

export const organizationRelations = relations(organization, ({many}) => ({
	units: many(unit),
}));

export const memberRelations = relations(member, ({one}) => ({
	unit: one(unit, {
		fields: [member.unitId],
		references: [unit.id]
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	members: many(member),
	invitations: many(invitation),
}));

export const invitationRelations = relations(invitation, ({one}) => ({
	unit: one(unit, {
		fields: [invitation.unitId],
		references: [unit.id]
	}),
	user: one(user, {
		fields: [invitation.userId],
		references: [user.id]
	}),
}));

export const productRelations = relations(product, ({one}) => ({
	unit: one(unit, {
		fields: [product.unitId],
		references: [unit.id]
	}),
}));