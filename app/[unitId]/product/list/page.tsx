import { productColumns } from "@/components/columns/product"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/(inv)/instance"
import { product } from "@/orm/(inv)/schema"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<{ unitId: string }>
}

const Page = async ({ params }: Props) => {
  const { unitId } = await params
  const data = await db.query.product.findMany({
    where: eq(product.unitId, unitId),
  })
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={productColumns} data={data} />
    </div>
  )
}

export default Page
