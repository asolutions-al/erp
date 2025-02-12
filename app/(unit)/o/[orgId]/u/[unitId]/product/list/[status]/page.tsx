import { productColumns } from "@/components/columns/product"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { product } from "@/orm/app/schema"
import { EntityStatusT } from "@/types/enum"
import { and, asc, eq } from "drizzle-orm"

type Props = {
  params: Promise<{ unitId: string; status: EntityStatusT }>
}

const Page = async ({ params }: Props) => {
  const { unitId, status } = await params

  const data = await db.query.product.findMany({
    where: and(eq(product.unitId, unitId), eq(product.status, status)),
    orderBy: asc(product.name),
  })

  return <DataTable columns={productColumns} data={data} />
}

export default Page
