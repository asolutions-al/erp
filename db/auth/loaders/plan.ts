"use server"
import "server-only"

import { db } from "@/db/auth/instance"
import { plan, planId } from "@/orm/auth/schema"
import { eq } from "drizzle-orm"

const get = () =>
  db.query.plan.findMany({
    where: eq(plan.product, "INVOICE"),
  })

const getById = (id: (typeof planId.enumValues)[number]) =>
  db.query.plan.findFirst({
    where: eq(plan.id, id),
  })

export { getById as getPlanById, get as getPlans }
