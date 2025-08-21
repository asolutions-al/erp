import { warehouseColumns } from "@/components/columns/warehouse"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { getRole } from "@/db/app/loaders"
import { getUserId } from "@/db/auth/loaders"
import { warehouse } from "@/orm/app/schema"
import { EntityStatusT } from "@/types/enum"
import { and, asc, eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParamsT & { status: EntityStatusT }>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId, status } = await params
  const userId = await getUserId()
  const role = await getRole({ userId, orgId })

  const data = await db.query.warehouse.findMany({
    where: and(eq(warehouse.unitId, unitId), eq(warehouse.status, status)),
    orderBy: asc(warehouse.name),
    with: {
      productInventories: {
        columns: {
          stock: true,
        },
        with: {
          product: {
            columns: {
              // needed for client-side filtering,
              // TODO: filter on the query
              status: true,
            },
          },
        },
      },
    },
  })

  const meta: GlobalTableMetaT = {
    role,
    userId,
  }

  return <DataTable columns={warehouseColumns} data={data} meta={meta} />
}

export default Page
