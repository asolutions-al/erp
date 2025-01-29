import { invoiceColumns } from "@/components/columns/invoice"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { invoice } from "@/orm/app/schema"
import { eq } from "drizzle-orm"
import { PlusCircleIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

type Props = {
  params: Promise<{ orgId: string; unitId: string }>
}

export const dynamic = "force-dynamic"

const Page = async ({ params }: Props) => {
  const t = await getTranslations()
  const { orgId, unitId } = await params
  const data = await db.query.invoice.findMany({
    where: eq(invoice.unitId, unitId),
  })

  return (
    <>
      <div className="mb-3 flex flex-row justify-between">
        <div />
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
