import { orgColumns } from "@/components/columns/org"
import { Loading } from "@/components/layout/loading"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { createAuthClient } from "@/db/auth/client"
import { organization } from "@/orm/app/schema"
import { eq } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"

const List = async () => {
  const client = await createAuthClient()
  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) return null

  const data = await db.query.organization.findMany({
    where: eq(organization.ownerId, user.id),
  })

  return <DataTable columns={orgColumns} data={data} />
}

const Page = async () => {
  const t = await getTranslations()
  return (
    <div className="m-4 space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("Organizations")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("Organizations that are associated with your account")}.
        </p>
      </div>
      <Suspense fallback={<Loading />}>
        <List />
      </Suspense>
    </div>
  )
}

export default Page
