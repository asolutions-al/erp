import { db } from "@/db/app/instance"
import { createAuthClient } from "@/db/auth/client"
import { orgMember } from "@/orm/app/schema"
import { and, eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  params: Promise<GlobalParamsT>
}>

const WithOrg = async ({ children, ...props }: PropsWithChildren<Props>) => {
  const { orgId } = await props.params

  const client = await createAuthClient()
  const {
    data: { user },
  } = await client.auth.getUser()

  const userId = user!.id

  const org = await db.query.orgMember.findFirst({
    where: and(eq(orgMember.userId, userId), eq(orgMember.orgId, orgId)),
  })

  if (!org) redirect("/")

  return children
}

export { WithOrg }
