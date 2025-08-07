"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { orgMember } from "@/orm/app/schema"
import { and, eq } from "drizzle-orm"
import { redirect } from "next/navigation"

const get = ({ userId, orgId }: { userId: string; orgId: string }) =>
  db.query.orgMember.findFirst({
    where: and(eq(orgMember.userId, userId), eq(orgMember.orgId, orgId)),
  })

const getRole = async ({
  userId,
  orgId,
}: {
  userId: string
  orgId: string
}) => {
  const orgMember = await get({ userId, orgId })
  if (!orgMember) redirect("/")
  return orgMember?.role
}

export { get as getOrgMember, getRole }
