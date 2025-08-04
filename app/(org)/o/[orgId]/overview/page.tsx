import { UnitCard } from "@/components/cards"
import { EmptyState } from "@/components/empty-state"
import { PageContent, PageListHeader } from "@/components/layout"
import { db } from "@/db/app/instance"
import { unit } from "@/orm/app/schema"
import { and, eq } from "drizzle-orm"
import { Building2 } from "lucide-react"
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
      <PageListHeader
        title="Units"
        button={{
          text: "Create new unit",
          href: `/o/${orgId}/unit/create`,
        }}
      />

      <PageContent>
        {data.length > 0 ? (
          <>
            <div className="mb-4 mt-2 text-center text-sm text-muted-foreground">
              {t("Click on any unit below to enter and manage its operations")}
            </div>
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
      </PageContent>
    </>
  )
}

export default Page
