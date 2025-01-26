import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { PropsWithChildren, Suspense } from "react"

import { SidebarMain } from "@/components/layout/sidebar-main"
import { SidebarUser } from "@/components/layout/sidebar-user"
import Image from "next/image"
import Link from "next/link"

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
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center border-b px-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Link href={`/org/${orgId}/~/list`}>
            <Image src="/logo.png" alt="logo" width={30} height={30} />
          </Link>

          <div className="ml-auto md:hidden">
            <SidebarTrigger />
          </div>
        </header>
        <div className="m-1.5 flex-1 md:m-2 lg:m-2.5">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
