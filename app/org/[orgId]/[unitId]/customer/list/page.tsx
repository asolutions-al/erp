import { customerColumns } from "@/components/columns/customer"
import { StatusTabs } from "@/components/tabs/status"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { customer, status } from "@/orm/app/schema"
import { and, eq } from "drizzle-orm"
import { PlusCircleIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

type Props = {
  params: Promise<{ orgId: string; unitId: string }>
  searchParams: Promise<{
    status?: (typeof status.enumValues)[number]
  }>
}

const Page = async ({ params, searchParams }: Props) => {
  const t = await getTranslations()
  const { orgId, unitId } = await params
  const { status = "active" } = await searchParams

  const data = await db.query.customer.findMany({
    where: and(eq(customer.unitId, unitId), eq(customer.status, status)),
    orderBy: customer.name,
  })

  return (
    <>
      <div className="mb-3 flex flex-row justify-between">
        <StatusTabs defaultValue={status} />
        <Link href={`/org/${orgId}/${unitId}/customer/create`} passHref>
          <Button>
            <PlusCircleIcon />
            <span className="sr-only sm:not-sr-only">{t("New customer")}</span>
          </Button>
        </Link>
      </div>
      <DataTable columns={customerColumns} data={data} />
    </>
  )
}

export default Page
