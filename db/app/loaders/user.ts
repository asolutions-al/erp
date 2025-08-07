"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { user } from "@/orm/app/schema"
import { eq } from "drizzle-orm"

const get = async ({ id }: { id: string }) =>
  db.query.user.findFirst({
    where: eq(user.id, id),
  })

export { get as getUser }
