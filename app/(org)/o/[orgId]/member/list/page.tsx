import { orgMemberColumns } from "@/components/columns/orgMember"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { orgMember } from "@/orm/app/schema"
import { eq } from "drizzle-orm"
import { PlusCircleIcon, UsersIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

type Props = {
  params: Promise<{ orgId: string }>
}

const Page = async ({ params }: Props) => {
  const t = await getTranslations()
  const { orgId } = await params

  const data = await db.query.orgMember.findMany({
    where: eq(orgMember.orgId, orgId),
    with: { user: true },
  })

  return (
    <>
      <div className="mb-3 flex flex-row justify-between">
        <div className="flex items-center gap-2">
          <UsersIcon />
          <h1 className="text-2xl font-semibold">{t("Members")}</h1>
        </div>
        {/* <Link href={`/o/${orgId}/member/create`} passHref>
          <Button>
            <PlusCircleIcon />
            <span className="sr-only sm:not-sr-only">{t("New member")}</span>
          </Button>
        </Link> */}
      </div>
      <DataTable columns={orgMemberColumns} data={data} />
    </>
  )
}

export default Page
