"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { category } from "@/orm/app/schema"
import { CategoryFormSchemaT } from "@/providers"
import { eq } from "drizzle-orm"

type FormSchemaT = CategoryFormSchemaT

const create = async ({
  values,
  unitId,
  orgId,
}: {
  values: FormSchemaT
  unitId: string
  orgId: string
}) => {
  await db.insert(category).values({
    ...values,
    unitId,
    orgId,
  })
}

const update = async ({ values, id }: { values: FormSchemaT; id: string }) => {
  await db.update(category).set(values).where(eq(category.id, id))
}

const markAsFavorite = async ({
  id,
  isFavorite,
}: {
  id: string
  isFavorite: boolean
}) => {
  await db.update(category).set({ isFavorite }).where(eq(category.id, id))
}

export {
  create as createCategory,
  markAsFavorite as markCategoryAsFavorite,
  update as updateCategory,
}
