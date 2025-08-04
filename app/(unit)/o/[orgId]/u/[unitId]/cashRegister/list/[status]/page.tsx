import { cashRegisterColumns } from "@/components/columns/cashRegister"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { cashRegister } from "@/orm/app/schema"
import { EntityStatusT } from "@/types/enum"
import { and, asc, eq } from "drizzle-orm"

type Props = {
  params: Promise<{ unitId: string; status: EntityStatusT }>
}

const Page = async ({ params }: Props) => {
  const { unitId, status } = await params

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

  return <DataTable columns={cashRegisterColumns} data={data} />
}

export default Page
