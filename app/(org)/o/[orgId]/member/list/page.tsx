import { orgMemberColumns } from "@/components/columns/orgMember"
import { PageHeader } from "@/components/layout"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { orgMember } from "@/orm/app/schema"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<{ orgId: string }>
}

const Page = async ({ params }: Props) => {
  const { orgId } = await params

  const data = await db.query.orgMember.findMany({
    where: eq(orgMember.orgId, orgId),
    with: { user: true },
  })

  return (
    <>
      <PageHeader title="Members" className="mb-2" />
      <div className="mx-auto max-w-4xl">
        <DataTable columns={orgMemberColumns} data={data} />
      </div>
    </>
  )
}

export default Page
