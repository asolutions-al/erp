import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { PropsWithChildren } from "react"

import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"

type Props = PropsWithChildren<{
  params: Promise<{ orgId: string; unitId: string }>
}>

export const experimental_ppr = true

const Layout = async (props: Props) => {
  const { children } = props

  const { orgId, unitId } = await props.params

  return (
    <SidebarProvider>
      <AppSidebar orgId={orgId} unitId={unitId} />
      <SidebarInset>
        <AppHeader orgId={orgId} />
        <div className="m-1.5 flex-1 md:m-2 lg:m-2.5">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
