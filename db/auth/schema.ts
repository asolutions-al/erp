import { plan } from "@/orm/auth/schema"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

/////////////PLAN/////////////////////
const planSchema = createSelectSchema(plan)
export type PlanSchemaT = z.infer<typeof planSchema>
