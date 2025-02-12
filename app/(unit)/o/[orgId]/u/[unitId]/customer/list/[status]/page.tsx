import { customerColumns } from "@/components/columns/customer"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { customer } from "@/orm/app/schema"
import { EntityStatusT } from "@/types/enum"
import { and, asc, eq } from "drizzle-orm"

type Props = {
  params: Promise<{ unitId: string; status: EntityStatusT }>
}

const Page = async (props: Props) => {
  const { params } = props
  const { unitId, status } = await params

  const data = await db.query.customer.findMany({
    where: and(eq(customer.unitId, unitId), eq(customer.status, status)),
    orderBy: asc(customer.name),
  })

  return <DataTable columns={customerColumns} data={data} />
}

export default Page
