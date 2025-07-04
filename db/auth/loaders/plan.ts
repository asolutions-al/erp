"use server"
import "server-only"

import { db } from "@/db/auth/instance"
import { plan } from "@/orm/auth/schema"
import { eq } from "drizzle-orm"

const get = () =>
  db.query.plan.findMany({
    where: eq(plan.product, "INVOICE"),
  })

export { get as getPlans }
