import { product, unit } from "@/orm/(inv)/schema"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

/////////////UNIT/////////////////////
export const unitSchema = createSelectSchema(unit)
export type UnitSchemaT = z.infer<typeof unitSchema>

/////////////PRODUCT/////////////////////
export const productSchema = createSelectSchema(product)
export type ProductSchemaT = z.infer<typeof productSchema>
