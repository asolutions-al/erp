import { productColumns } from "@/components/columns/product"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { getRole } from "@/db/app/loaders"
import { getUserId } from "@/db/auth/loaders"
import { product } from "@/orm/app/schema"
import { EntityStatusT } from "@/types/enum"
import { and, asc, eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParamsT & { status: EntityStatusT }>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId, status } = await params
  const userId = await getUserId()
  const role = await getRole({ userId, orgId })

  const data = await db.query.product.findMany({
    where: and(eq(product.unitId, unitId), eq(product.status, status)),
    orderBy: asc(product.name),
    with: {
      productInventories: {
        columns: {
          stock: true,
        },
      },
      productCategories: {
        with: {
          category: true,
        },
      },
    },
  })

  const meta: GlobalTableMetaT = {
    role,
    userId,
  }

  return <DataTable columns={productColumns} data={data} meta={meta} />
}

export default Page
