import { supplierColumns } from "@/components/columns/supplier"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { supplier } from "@/orm/app/schema"
import { EntityStatusT } from "@/types/enum"
import { and, asc, eq } from "drizzle-orm"

type Props = {
  params: Promise<{ unitId: string; status: EntityStatusT }>
}

const Page = async (props: Props) => {
  const { params } = props
  const { unitId, status } = await params

  const data = await db.query.supplier.findMany({
    where: and(eq(supplier.unitId, unitId), eq(supplier.status, status)),
    orderBy: asc(supplier.name),
  })

  return <DataTable columns={supplierColumns} data={data} />
}

export default Page
