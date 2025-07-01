import { UnitCard } from "@/components/cards"
import { PageHeader } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { db } from "@/db/app/instance"
import { unit } from "@/orm/app/schema"
import { eq } from "drizzle-orm"
import { PlusCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

type Props = {
  params: Promise<{ orgId: string }>
}
const Page = async ({ params }: Props) => {
  const { orgId } = await params
  const t = await getTranslations()

  const data = await db.query.unit.findMany({
    where: eq(unit.orgId, orgId),
  })

  return (
    <>
      <PageHeader
        title="Select unit"
        rightComp={
          <Link href={`/o/${orgId}/unit/create`}>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {t("Create new unit")}
              </span>
            </Button>
          </Link>
        }
        className="mb-2"
      />
      <div className="mx-auto grid max-w-4xl items-center gap-4 sm:grid-cols-2">
        {data.map((unit) => (
          <Link
            key={unit.id}
            href={`/o/${orgId}/u/${unit.id}/overview/dashboard/today`}
          >
            <UnitCard data={unit} />
          </Link>
        ))}
      </div>
    </>
  )
}

export default Page
