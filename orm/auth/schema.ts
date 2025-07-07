import { pgTable, uuid, timestamp, text, doublePrecision, bigint, smallint, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const planId = pgEnum("PLAN_ID", ['INVOICE-STARTER', 'INVOICE-PRO', 'INVOICE-BUSINESS'])
export const product = pgEnum("PRODUCT", ['INVOICE'])


export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	email: text().notNull(),
});

export const plan = pgTable("plan", {
	product: product().notNull(),
	name: text().notNull(),
	monthlyPrice: doublePrecision().notNull(),
	yearlyPrice: doublePrecision().notNull(),
	id: planId().primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	maxInvoices: bigint({ mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	maxUnits: bigint({ mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	maxMembers: bigint({ mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	maxCustomers: bigint({ mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	maxProducts: bigint({ mode: "number" }).notNull(),
	tier: smallint().notNull(),
	paypalPlanId: text().notNull(),
	paypalSandboxPlanId: text().notNull(),
});
