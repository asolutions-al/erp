import { SidebarItemSimple } from "@/components/buttons"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ArrowLeftIcon, SettingsIcon, StoreIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { PropsWithChildren, Suspense } from "react"
import { SidebarUser } from "./sidebar-user"

type Props = PropsWithChildren<{}>

const AccountSidebar = async (props: Props) => {
  const t = await getTranslations()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/o/list" passHref>
          <SidebarMenuButton>
            <ArrowLeftIcon />
            {t("Go back")}
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("Menu")}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarItemSimple
              text="Organizations"
              icon={<StoreIcon />}
              href="/account/overview/orgs"
              activeHref="/account/overview/orgs"
            />
            <SidebarItemSimple
              text="Settings"
              icon={<SettingsIcon />}
              href="/account/settings/general"
              activeHref="/account/settings/general"
            />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <Suspense>
        <SidebarUser />
      </Suspense>
      <SidebarRail />
    </Sidebar>
  )
}

export { AccountSidebar }
