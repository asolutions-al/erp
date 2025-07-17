import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { PropsWithChildren } from "react"

import { AccountSidebar } from "@/components/layout/account-sidebar"
import { AppHeader } from "@/components/layout/app-header"

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
        <AppHeader {...props} />
        <div className="m-1.5 flex-1 md:m-2 lg:m-2.5">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
