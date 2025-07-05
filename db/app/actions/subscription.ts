"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { subscription } from "@/orm/app/schema"
import { eq } from "drizzle-orm"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

const schema = createInsertSchema(subscription)
type SchemaT = z.infer<typeof schema>

const getByOrgId = async (orgId: string) => {
  return await db.query.subscription.findFirst({
    where: eq(subscription.orgId, orgId),
    orderBy: (subscription, { desc }) => [desc(subscription.createdAt)],
  })
}

const create = async (data: SchemaT) => {
  return await db.insert(subscription).values(data)
}

const update = async ({
  id,
  values,
}: {
  id: string
  values: Partial<SchemaT>
}) => {
  return await db
    .update(subscription)
    .set(values)
    .where(eq(subscription.id, id))
}

export {
  create as createSubscription,
  getByOrgId as getSubscriptionByOrgId,
  update as updateSubscription,
}
