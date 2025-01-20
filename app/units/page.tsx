import { UnitCard } from "@/components/cards"
import { PageHeader } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { createAuthClient } from "@/db/(auth)/client"
import { db } from "@/db/(inv)/instance"
import { member } from "@/orm/(inv)/schema"
import { eq } from "drizzle-orm"
import { PlusCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

const Page = async () => {
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
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {t("Create unit")}
            </span>
          </Button>
        )}
        className="my-4"
      />
      <div className="max-w-4xl mx-auto grid items-center sm:grid-cols-2 gap-4">
        {unitsList.map((unit) => (
          <Link key={unit.id} href={`/${unit.id}/dashboard`}>
            <UnitCard data={unit} />
          </Link>
        ))}
      </div>
    </>
  )
}

export default Page
