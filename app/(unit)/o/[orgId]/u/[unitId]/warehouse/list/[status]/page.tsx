import { warehouseColumns } from "@/components/columns/warehouse"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { warehouse } from "@/orm/app/schema"
import { EntityStatusT } from "@/types/enum"
import { and, asc, eq } from "drizzle-orm"

type Props = {
  params: Promise<{ unitId: string; status: EntityStatusT }>
}

const Page = async ({ params }: Props) => {
  const { unitId, status } = await params

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

  return <DataTable columns={warehouseColumns} data={data} />
}

export default Page
