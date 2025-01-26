import {
  pgTable,
  pgEnum,
  text,
  numeric,
  uuid,
  timestamp,
  foreignKey,
  unique,
  bigint,
  doublePrecision,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const aal_level = pgEnum("aal_level", ["aal1", "aal2", "aal3"])
export const code_challenge_method = pgEnum("code_challenge_method", [
  "s256",
  "plain",
])
export const factor_status = pgEnum("factor_status", ["unverified", "verified"])
export const factor_type = pgEnum("factor_type", ["totp", "webauthn", "phone"])
export const one_time_token_type = pgEnum("one_time_token_type", [
  "confirmation_token",
  "reauthentication_token",
  "recovery_token",
  "email_change_token_new",
  "email_change_token_current",
  "phone_change_token",
])
export const key_status = pgEnum("key_status", [
  "default",
  "valid",
  "invalid",
  "expired",
])
export const key_type = pgEnum("key_type", [
  "aead-ietf",
  "aead-det",
  "hmacsha512",
  "hmacsha256",
  "auth",
  "shorthash",
  "generichash",
  "kdf",
  "secretbox",
  "secretstream",
  "stream_xchacha20",
])
export const CURRENCY = pgEnum("CURRENCY", ["ALL", "EUR", "USD"])
export const ORDER_STATUS = pgEnum("ORDER_STATUS", [
  "PENDING",
  "COMPLETED",
  "FAILED",
])
export const PAYPAL_ORDER_STATUS = pgEnum("PAYPAL_ORDER_STATUS", [
  "PAYER_ACTION_REQUIRED",
])
export const PLAN = pgEnum("PLAN", ["INV-STARTER", "INV-PRO", "INV-BUSINESS"])
export const PRODUCT = pgEnum("PRODUCT", ["INV"])
export const UserRole = pgEnum("UserRole", ["ADMIN", "USER"])
export const action = pgEnum("action", [
  "INSERT",
  "UPDATE",
  "DELETE",
  "TRUNCATE",
  "ERROR",
])
export const equality_op = pgEnum("equality_op", [
  "eq",
  "neq",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
])

export const plan = pgTable("plan", {
  product: PRODUCT("product").notNull(),
  name: text("name").notNull(),
  monthlyPrice: numeric("monthlyPrice").notNull(),
  yearlyPrice: numeric("yearlyPrice").notNull(),
  id: PLAN("id"),
})

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  email: text("email").notNull(),
})

export const orders = pgTable(
  "orders",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "orders_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    status: ORDER_STATUS("status").notNull(),
    totalAmount: doublePrecision("totalAmount").notNull(),
    currency: CURRENCY("currency").notNull(),
    paypalOrderId: text("paypalOrderId").notNull(),
    paypalPayerId: text("paypalPayerId"),
    paypalPaymentId: text("paypalPaymentId"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    planId: bigint("planId", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      orders_id_key: unique("orders_id_key").on(table.id),
    }
  }
)
