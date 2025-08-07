"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { orgMember } from "@/orm/app/schema"
import { and, eq } from "drizzle-orm"

const get = ({ userId, orgId }: { userId: string; orgId: string }) =>
  db.query.orgMember.findFirst({
    where: and(eq(orgMember.userId, userId), eq(orgMember.orgId, orgId)),
  })

export { get as getOrgMember }
