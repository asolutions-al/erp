import { invoiceColumns } from "@/components/columns/invoice"
import { RangeTabs } from "@/components/tabs/range"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { mapRangeToStartEnd } from "@/contants/maps"
import { db } from "@/db/app/instance"
import { invoice } from "@/orm/app/schema"
import { and, desc, eq, gte, lte } from "drizzle-orm"
import { PlusCircleIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

type Props = {
  params: Promise<{ orgId: string; unitId: string }>
  searchParams: Promise<{ range?: RangeT }>
}

const Page = async (props: Props) => {
  const { params, searchParams } = props
  const { orgId, unitId } = await params
  const { range = "today" } = await searchParams
  const t = await getTranslations()
  const [start, end] = mapRangeToStartEnd(range)

  const data = await db.query.invoice.findMany({
    where: and(
      eq(invoice.unitId, unitId),
      gte(invoice.createdAt, start.toISOString()),
      lte(invoice.createdAt, end.toISOString())
    ),
    orderBy: desc(invoice.createdAt),
  })

  return (
    <>
      <div className="mb-3 flex flex-row justify-between">
        <RangeTabs defaultValue={range} />
        <Link href={`/org/${orgId}/${unitId}/invoice/create`} passHref>
          <Button>
            <PlusCircleIcon />
            <span className="sr-only sm:not-sr-only">
              {t("Create new invoice")}
            </span>
          </Button>
        </Link>
      </div>
      <DataTable columns={invoiceColumns} data={data} />
    </>
  )
}

export default Page
