import { invoiceColumns } from "@/components/columns/invoice"
import { DataTable } from "@/components/ui/data-table"
import { mapRangeToStartEnd } from "@/contants/maps"
import { db } from "@/db/app/instance"
import { invoice } from "@/orm/app/schema"
import { and, desc, eq, gte, lte } from "drizzle-orm"

type Props = {
  params: Promise<{ unitId: string; range: RangeT }>
  searchParams: Promise<{ range?: RangeT }>
}

const Page = async (props: Props) => {
  const { params } = props
  const { unitId, range } = await params

  const [start, end] = mapRangeToStartEnd(range)

  const data = await db.query.invoice.findMany({
    where: and(
      eq(invoice.unitId, unitId),
      gte(invoice.createdAt, start.toISOString()),
      lte(invoice.createdAt, end.toISOString())
    ),
    orderBy: desc(invoice.createdAt),
  })

  return <DataTable columns={invoiceColumns} data={data} />
}

export default Page
