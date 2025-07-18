"use server"
import "server-only"

import { db } from "@/db/auth/instance"
import { plan } from "@/orm/auth/schema"
import { eq } from "drizzle-orm"

const isDev = process.env.NODE_ENV === "development"

/**
 * Get plan by PayPal plan ID
 * This replaces the need for manual plan mapping
 */
export async function getPlanByPayPalId(id: string) {
  return await db.query.plan.findFirst({
    where: eq(isDev ? plan.paypalSandboxPlanId : plan.paypalPlanId, id),
  })
}

/**
 * Get all plans with their PayPal plan IDs
 * Useful for creating reverse mapping if needed
 */
export async function getAllPlans() {
  return await db.query.plan.findMany()
}
