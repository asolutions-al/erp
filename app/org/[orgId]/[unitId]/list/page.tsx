import { UnitCard } from "@/components/cards"
import { PageHeader } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { db } from "@/db/app/instance"
import { createAuthClient } from "@/db/auth/client"
import { member } from "@/orm/app/schema"
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
  const client = await createAuthClient()
  const {
    data: { user },
  } = await client.auth.getUser()
  const userId = user!.id

  const members = await db.query.member.findMany({
    where: eq(member.userId, userId),
    with: { unit: true },
  })

  const unitsList = members.map((member) => member.unit)

  return (
    <>
      <PageHeader
        title="Select unit"
        renderRight={() => (
          <Link href={`/org/${orgId}/~/create`}>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {t("Create new unit")}
              </span>
            </Button>
          </Link>
        )}
        className="my-4"
      />
      <div className="mx-auto grid max-w-4xl items-center gap-4 sm:grid-cols-2">
        {unitsList.map((unit) => (
          <Link key={unit.id} href={`/org/${orgId}/${unit.id}/product/list`}>
            <UnitCard data={unit} />
          </Link>
        ))}
      </div>
    </>
  )
}

export default Page
