import { orgColumns } from "@/components/columns/org"
import { PageListHeader } from "@/components/layout"
import { Loading } from "@/components/layout/loading"
import { DataTable } from "@/components/ui/data-table"
import { db } from "@/db/app/instance"
import { createAuthClient } from "@/db/auth/client"
import { organization } from "@/orm/app/schema"
import { eq } from "drizzle-orm"
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
  return (
    <>
      <PageListHeader title="Organizations" />
      <div className="mx-auto max-w-4xl">
        <Suspense fallback={<Loading />}>
          <List />
        </Suspense>
      </div>
    </>
  )
}

export default Page
