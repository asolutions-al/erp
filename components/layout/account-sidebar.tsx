import { SidebarItem as SidebarItemSS } from "@/components/buttons"
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
import {
  ArrowLeftIcon,
  BrickWallIcon,
  IdCardIcon,
  SettingsIcon,
  StoreIcon,
} from "lucide-react"
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
            <SidebarItemSS
              text="Overview"
              href="/account/overview/orgs"
              icon={<BrickWallIcon />}
              subItems={[
                {
                  href: "/account/overview/orgs",
                  text: "Organizations",
                  icon: <StoreIcon />,
                },
              ]}
            />
            <SidebarItemSS
              text="Settings"
              href="/account/settings/general"
              icon={<SettingsIcon />}
              subItems={[
                {
                  href: "/account/settings/general",
                  text: "General",
                  icon: <IdCardIcon />,
                },
              ]}
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
