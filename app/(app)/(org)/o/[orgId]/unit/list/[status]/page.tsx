import { unitColumns } from "@/components/columns/unit"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { getRole } from "@/db/app/loaders"
import { getUserId } from "@/db/auth/loaders"
import { unit } from "@/orm/app/schema"
import { EntityStatusT } from "@/types/enum"
import { and, eq } from "drizzle-orm"

type Props = {
  params: Promise<{ orgId: string; status: EntityStatusT }>
}
const Page = async ({ params }: Props) => {
  const { orgId, status } = await params
  const userId = await getUserId()
  const role = await getRole({ userId, orgId })

  const data = await db.query.unit.findMany({
    where: and(eq(unit.orgId, orgId), eq(unit.status, status)),
  })

  const meta: GlobalTableMetaT = {
    role,
    userId,
  }

  return <DataTable columns={unitColumns} data={data} meta={meta} />
}

export default Page
