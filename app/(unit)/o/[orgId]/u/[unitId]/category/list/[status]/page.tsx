import { categoryColumns } from "@/components/columns/category"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { category } from "@/orm/app/schema"
import { EntityStatusT } from "@/types/enum"
import { and, asc, eq } from "drizzle-orm"

type Props = {
  params: Promise<{ unitId: string; status: EntityStatusT }>
}

const Page = async ({ params }: Props) => {
  const { unitId, status } = await params

  const data = await db.query.category.findMany({
    where: and(eq(category.unitId, unitId), eq(category.status, status)),
    orderBy: asc(category.name),
  })

  return <DataTable columns={categoryColumns} data={data} />
}

export default Page
