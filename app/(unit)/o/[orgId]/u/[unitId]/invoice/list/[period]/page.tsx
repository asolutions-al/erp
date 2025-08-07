import { invoiceColumns } from "@/components/columns/invoice"
import { DataTable } from "@/components/ui/data-table"
import { mapRangeToStartEnd } from "@/constants/maps"
import { db } from "@/db/app/instance"
import { getOrgMember, getRole } from "@/db/app/loaders"
import { getUserId } from "@/db/auth/loaders"
import { invoice } from "@/orm/app/schema"
import { and, desc, eq, gte, lte } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParamsT & { period: PeriodT }>
}

const Page = async (props: Props) => {
  const { params } = props
  const { orgId, unitId, period } = await params
  const userId = await getUserId()
  const role = await getRole({ userId, orgId })
  const meta: GlobalTableMetaT = {
    role,
    userId,
  }
  const [start, end] = mapRangeToStartEnd(period)

  const orgUser = await getOrgMember({ userId, orgId })

  const [data] = await Promise.all([
    db.query.invoice.findMany({
      where: and(
        eq(invoice.unitId, unitId),
        gte(invoice.createdAt, start.toISOString()),
        lte(invoice.createdAt, end.toISOString()),
        ...(orgUser?.role === "member" ? [eq(invoice.createdBy, userId)] : [])
      ),
      orderBy: desc(invoice.createdAt),
      with: {
        customer: true,
        cashRegister: true,
        warehouse: true,
        user_createdBy: true,
      },
    }),
  ])
  console.log("orgUser", orgUser)
  return <DataTable columns={invoiceColumns} data={data} meta={meta} />
}

export default Page
