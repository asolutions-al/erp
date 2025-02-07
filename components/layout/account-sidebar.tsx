import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  ArrowLeftIcon,
  BrickWallIcon,
  BuildingIcon,
  ChevronRight,
  CirclePlusIcon,
  ContactIcon,
  HomeIcon,
  IdCardIcon,
  ListTreeIcon,
  PackageIcon,
  ReceiptTextIcon,
  SettingsIcon,
  StoreIcon,
  SunMoonIcon,
  UserIcon,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { PropsWithChildren, Suspense } from "react"
import { SidebarItem } from "../sidebar-item"
import { Skeleton } from "../ui/skeleton"
import { SidebarUser } from "./sidebar-user"
import Link from "next/link"

type Props = PropsWithChildren<{}>

const AccountSidebar = async (props: Props) => {
  const t = await getTranslations()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/o/list" passHref>
          <SidebarMenuButton>
            <ArrowLeftIcon />
            {t("Back to dashboard")}
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("Menu")}</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible asChild defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={t("Overview")}>
                    <BrickWallIcon />
                    <span className="font-semibold">{t("Overview")}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarItem
                      href="/account/overview/orgs"
                      text="Organizations"
                      icon={<StoreIcon />}
                    />
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
            <Collapsible asChild defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={t("Settings")}>
                    <SettingsIcon />
                    <span className="font-semibold">{t("Settings")}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarItem
                      href="/account/settings/general"
                      text="General"
                      icon={<IdCardIcon />}
                    />
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
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

const SwitcherSkeleton = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="w-full justify-start">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="flex flex-col items-start gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { AccountSidebar }
