import { plan } from "@/orm/(auth)/schema"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const selectPlanSchema = createSelectSchema(plan)
export type SelectPlanType = z.infer<typeof selectPlanSchema>
