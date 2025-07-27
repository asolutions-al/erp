import { DemoBanner } from "@/components/banner"
import { OrgSidebar } from "@/components/layout/org-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WithOrg } from "@/components/wrapper"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  params: Promise<GlobalParamsT>
}>

export const experimental_ppr = true

const Layout = async (props: Props) => {
  const { children } = props
  return (
    <WithOrg {...props}>
      <SidebarProvider>
        <OrgSidebar {...props} />
        <SidebarInset className="w-full">
          <DemoBanner />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </WithOrg>
  )
}

export default Layout
