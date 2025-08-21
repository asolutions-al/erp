import { supplierColumns } from "@/components/columns/supplier"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { getRole } from "@/db/app/loaders"
import { getUserId } from "@/db/auth/loaders"
import { supplier } from "@/orm/app/schema"
import { EntityStatusT } from "@/types/enum"
import { and, asc, eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParamsT & { status: EntityStatusT }>
}

const Page = async (props: Props) => {
  const { params } = props
  const { orgId, unitId, status } = await params
  const userId = await getUserId()
  const role = await getRole({ userId, orgId })

  const data = await db.query.supplier.findMany({
    where: and(eq(supplier.unitId, unitId), eq(supplier.status, status)),
    orderBy: asc(supplier.name),
  })

  const meta: GlobalTableMetaT = {
    role,
    userId,
  }

  return <DataTable columns={supplierColumns} data={data} meta={meta} />
}

export default Page
