import { DemoBanner } from "@/components/banner"
import { AppHeader } from "@/components/layout"
import { OrgSidebar } from "@/components/layout/org-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  params: Promise<GlobalParamsT>
}>

export const experimental_ppr = true

const Layout = async (props: Props) => {
  const { children } = props

  return (
    <SidebarProvider>
      <OrgSidebar {...props} />
      <SidebarInset className="w-full">
        <AppHeader {...props} />
        <DemoBanner />
        <div className="m-1.5 flex-1 md:m-2 lg:m-2.5">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
