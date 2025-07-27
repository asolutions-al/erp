import { SidebarItemSimple } from "@/components/buttons"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BuildingIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  PackageIcon,
  UsersIcon,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { PropsWithChildren, Suspense } from "react"
import { OrgSwitcher } from "../org-switcher"
import { SidebarUser } from "./sidebar-user"

type Props = PropsWithChildren<{
  params: Promise<GlobalParamsT>
}>

const OrgSidebar = async (props: Props) => {
  const t = await getTranslations()
  const { orgId } = await props.params

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Suspense fallback={<SwitcherSkeleton />}>
          <OrgSwitcher {...props} />
        </Suspense>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <PackageIcon className="mr-1" />
            {t("Menu")}
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarItemSimple
              text="Overview"
              icon={<LayoutDashboardIcon />}
              href={`/o/${orgId}/overview`}
              activeHref={`/o/${orgId}/overview`}
            />
            <SidebarItemSimple
              text="Units"
              href={`/o/${orgId}/unit/list/active`}
              icon={<BuildingIcon />}
              activeHref={`/o/${orgId}/unit`}
            />
            <SidebarItemSimple
              text="Members"
              href={`/o/${orgId}/member/list`}
              icon={<UsersIcon />}
              activeHref={`/o/${orgId}/member`}
            />
            <SidebarItemSimple
              text="Subscriptions"
              href={`/o/${orgId}/billing/subscription`}
              icon={<CreditCardIcon />}
              activeHref={`/o/${orgId}/billing`}
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

export { OrgSidebar }
