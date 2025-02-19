import { productColumns } from "@/components/columns/product"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { product, productInventory } from "@/orm/app/schema"
import { EntityStatusT } from "@/types/enum"
import { and, asc, eq } from "drizzle-orm"

type Props = {
  params: Promise<{ unitId: string; status: EntityStatusT }>
}

const Page = async ({ params }: Props) => {
  const { unitId, status } = await params

  const [data, inventory] = await Promise.all([
    db.query.product.findMany({
      where: and(eq(product.unitId, unitId), eq(product.status, status)),
      orderBy: asc(product.name),
    }),
    db.query.productInventory.findMany({
      where: eq(productInventory.unitId, unitId),
    }),
  ])

  const mapped = data.map((d) => ({
    ...d,
    stock: inventory
      .filter((i) => i.productId === d.id)
      .reduce((acc, i) => acc + i.stock, 0),
  }))

  return <DataTable columns={productColumns} data={mapped} />
}

export default Page
