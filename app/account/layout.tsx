import { DemoBanner } from "@/components/banner"
import { AccountSidebar } from "@/components/layout/account-sidebar"
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
      <AccountSidebar {...props} />
      <SidebarInset className="w-full">
        <DemoBanner />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
