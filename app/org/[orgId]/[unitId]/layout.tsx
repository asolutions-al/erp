import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { PropsWithChildren, Suspense } from "react"

import { SidebarMain } from "@/components/layout/sidebar-main"
import { SidebarUser } from "@/components/layout/sidebar-user"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

type Props = PropsWithChildren<{
  params: Promise<{ orgId: string; unitId: string }>
}>

export const experimental_ppr = true

const Layout = async (props: Props) => {
  const { children } = props

  const { orgId, unitId } = await props.params

  const hasUnitId = unitId !== "~"

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarMain
            orgId={orgId}
            unitId={unitId === "~" ? undefined : unitId}
          />
        </SidebarContent>
        <Suspense>
          <SidebarUser />
        </Suspense>
        <SidebarRail />
      </Sidebar>
      <main className="relative flex min-h-svh flex-1 flex-col overflow-x-auto">
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Image src="/logo.png" alt="logo" width={30} height={30} />
          <Separator orientation="vertical" className="mx-2 h-4" />
        </header>

        <div className="m-1.5 flex-1 md:m-2 lg:m-2.5">{children}</div>
      </main>
    </SidebarProvider>
  )
}

export default Layout
