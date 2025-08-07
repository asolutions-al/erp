import { categoryColumns } from "@/components/columns/category"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { getRole } from "@/db/app/loaders"
import { getUserId } from "@/db/auth/loaders"
import { category } from "@/orm/app/schema"
import { EntityStatusT } from "@/types/enum"
import { and, asc, eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParamsT & { status: EntityStatusT }>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId, status } = await params
  const userId = await getUserId()
  const role = await getRole({ userId, orgId })

  const data = await db.query.category.findMany({
    where: and(eq(category.unitId, unitId), eq(category.status, status)),
    orderBy: asc(category.name),
  })

  const meta: GlobalTableMetaT = {
    role,
    userId,
  }

  return <DataTable columns={categoryColumns} data={data} meta={meta} />
}

export default Page
