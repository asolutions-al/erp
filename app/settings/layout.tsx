import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { PropsWithChildren, Suspense } from "react"

import { AppSidebarUser } from "@/components/layout/app-sidebar-user"

import { Collapsible } from "@/components/ui/collapsible"
import { SidebarGroup } from "@/components/ui/sidebar"

import {
  ChevronRight,
  CircleUserIcon,
  PaletteIcon,
  SettingsIcon,
  StoreIcon,
  SunMoonIcon,
} from "lucide-react"

import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import Link from "next/link"

type Props = PropsWithChildren<{
  params: Promise<{ orgId: string }>
}>

export const experimental_ppr = true

const Layout = async (props: Props) => {
  const { children } = props
  const t = await getTranslations()
  const items = [
    {
      title: t("Account"),
      icon: CircleUserIcon,
      items: [
        {
          title: t("General"),
          icon: SettingsIcon,
          url: "/settings/general",
        },
        {
          title: t("Organizations"),
          icon: StoreIcon,
          url: "/settings/orgs",
        },
        // {
        //   title: t("Activity"),
        //   icon: ActivityIcon,
        //   url: "/settings/activity",
        // },
      ],
    },
    {
      title: t("Theme"),
      icon: PaletteIcon,
      items: [
        {
          title: t("Appearance"),
          icon: SunMoonIcon,
          url: "/settings/appearance",
        },
      ],
    },
  ]

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t("Settings")}</SidebarGroupLabel>
            <SidebarMenu>
              {items.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  // @ts-ignore
                                  href={subItem.url}
                                >
                                  {subItem.icon && <subItem.icon />}
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <Suspense>
          <AppSidebarUser />
        </Suspense>
        <SidebarRail />
      </Sidebar>
      <main className="relative flex min-h-svh flex-1 flex-col overflow-x-auto">
        <header className="sticky top-0 z-10 flex h-16 items-center border-b px-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Link href={`/org/list`}>
            <Image src="/logo.png" alt="logo" width={30} height={30} />
          </Link>

          <div className="ml-auto md:hidden">
            <SidebarTrigger />
          </div>
        </header>
        <div className="m-1.5 flex-1 md:m-2 lg:m-2.5">{children}</div>
      </main>
    </SidebarProvider>
  )
}

export default Layout
