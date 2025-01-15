import { invoiceColumns } from "@/components/columns/invoice"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/(inv)/instance"
import { invoice } from "@/orm/(inv)/schema"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<{ unitId: string }>
}

const Page = async ({ params }: Props) => {
  const { unitId } = await params
  const data = await db.query.invoice.findMany({
    where: eq(invoice.unitId, unitId),
  })

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={invoiceColumns} data={data} />
    </div>
  )
}

export default Page
