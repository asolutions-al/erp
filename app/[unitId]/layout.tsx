import { AppHeader } from "@/components/layout/app-header"
import { AppSidebarNew } from "@/components/layout/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{}>

const Layout = async ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebarNew />
      <main className="relative flex min-h-svh flex-1 flex-col overflow-x-auto">
        <AppHeader />
        <div className="flex-1 m-1.5 md:m-2 lg:m-2.5">{children}</div>
      </main>
    </SidebarProvider>
  )
}

export default Layout
