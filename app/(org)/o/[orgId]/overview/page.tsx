import { UnitCard } from "@/components/cards"
import { EmptyState } from "@/components/empty-state"
import { PageHeader } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { db } from "@/db/app/instance"
import { unit } from "@/orm/app/schema"
import { and, eq } from "drizzle-orm"
import { Building2, PlusCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

type Props = {
  params: Promise<{ orgId: string }>
}
const Page = async ({ params }: Props) => {
  const { orgId } = await params
  const t = await getTranslations()

  const data = await db.query.unit.findMany({
    where: and(eq(unit.orgId, orgId), eq(unit.status, "active")),
  })

  return (
    <>
      <PageHeader
        title="Units"
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
        className="my-4"
      />
      {data.length > 0 ? (
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
      ) : (
        <EmptyState
          icon={Building2}
          title={t("No units found")}
          description={t(
            "Get started by creating your first unit to organize your business operations"
          )}
          className="py-12"
        />
      )}
    </>
  )
}

export default Page
