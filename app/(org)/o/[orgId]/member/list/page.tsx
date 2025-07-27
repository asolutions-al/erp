import { invitationColumns } from "@/components/columns/invitation"
import { orgMemberColumns } from "@/components/columns/orgMember"
import { PageHeader } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/db/app/instance"
import { invitation, orgMember } from "@/orm/app/schema"
import { and, eq } from "drizzle-orm"
import { PlusCircle, UserPlus, Users } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

type Props = {
  params: Promise<{ orgId: string }>
}

const Page = async ({ params }: Props) => {
  const { orgId } = await params
  const t = await getTranslations()

  const [members, invitations] = await Promise.all([
    db.query.orgMember.findMany({
      where: eq(orgMember.orgId, orgId),
      with: { user: true },
    }),
    db.query.invitation.findMany({
      where: and(eq(invitation.orgId, orgId)),
    }),
  ])

  return (
    <>
      <PageHeader
        title="Members"
        className="mb-2"
        rightComp={
          <Link href={`/o/${orgId}/member/create`}>
            <Button size="sm">
              <PlusCircle />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {t("New member")}
              </span>
            </Button>
          </Link>
        }
      />
      <div className="mx-auto max-w-4xl">
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("Members")} ({members.length})
            </TabsTrigger>
            <TabsTrigger
              value="invitations"
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              {t("Invitations")} ({invitations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <DataTable columns={orgMemberColumns} data={members} />
          </TabsContent>

          <TabsContent value="invitations">
            <DataTable columns={invitationColumns} data={invitations} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default Page
