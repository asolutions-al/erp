import { AppHeader } from "@/components/layout/app-header"
import { AppSidebarNew } from "@/components/layout/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { createAuthClient } from "@/db/(auth)/client"
import { db } from "@/db/(inv)/instance"
import { member } from "@/orm/(inv)/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { PropsWithChildren, Suspense } from "react"

type Props = PropsWithChildren<{
  params: Promise<{ unitId: string }>
}>

const UnitValidator = async ({ unitId }: { unitId: string }) => {
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
  const unitIsValid = unitsList.some((unit) => unit.id === unitId)

  if (!unitIsValid) return redirect(`/units`)

  return null
}

const Layout = async ({ children, params }: Props) => {
  const { unitId } = await params

  return (
    <SidebarProvider>
      <AppSidebarNew />
      <main className="relative flex min-h-svh flex-1 flex-col overflow-x-auto">
        <AppHeader />
        <div className="flex-1 m-1.5 md:m-2 lg:m-2.5">{children}</div>
      </main>
      <Suspense>
        <UnitValidator unitId={unitId} />
      </Suspense>
    </SidebarProvider>
  )
}

export default Layout
