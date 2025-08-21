import { cashRegisterColumns } from "@/components/columns/cashRegister"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { getRole } from "@/db/app/loaders"
import { getUserId } from "@/db/auth/loaders"
import { cashRegister } from "@/orm/app/schema"
import { EntityStatusT } from "@/types/enum"
import { and, asc, eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParamsT & { status: EntityStatusT }>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId, status } = await params
  const userId = await getUserId()
  const role = await getRole({ userId, orgId })

  const data = await db.query.cashRegister.findMany({
    where: and(
      eq(cashRegister.unitId, unitId),
      eq(cashRegister.status, status)
    ),
    orderBy: asc(cashRegister.name),
    with: {
      user_closedBy: true,
    },
  })

  const meta: GlobalTableMetaT = {
    role,
    userId,
  }

  return <DataTable columns={cashRegisterColumns} data={data} meta={meta} />
}

export default Page
