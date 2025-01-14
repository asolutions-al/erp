import { relations } from "drizzle-orm/relations";
import { user, orders } from "./schema";

export const ordersRelations = relations(orders, ({one}) => ({
	user: one(user, {
		fields: [orders.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	orders: many(orders),
}));