import { SidebarItem } from "@/components/buttons"
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
  BrickWallIcon,
  BuildingIcon,
  CirclePlusIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  ListTreeIcon,
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
          <SidebarGroupLabel>{t("Menu")}</SidebarGroupLabel>

          <SidebarMenu>
            <SidebarItem
              text="Overview"
              icon={<BrickWallIcon />}
              href={`/o/${orgId}/overview`}
              subItems={[
                {
                  href: `/o/${orgId}/overview`,
                  text: "Dashboard",
                  icon: <LayoutDashboardIcon />,
                },
              ]}
            />
            <SidebarItem
              text="Unit"
              href={`/o/${orgId}/unit/list/active`}
              icon={<BuildingIcon />}
              subItems={[
                {
                  href: `/o/${orgId}/unit/list/active`,
                  text: "List",
                  icon: <ListTreeIcon />,
                },
                {
                  href: `/o/${orgId}/unit/create`,
                  text: "Create",
                  icon: <CirclePlusIcon />,
                },
              ]}
            />
            <SidebarItem
              text="Member"
              href={`/o/${orgId}/member/list`}
              icon={<UsersIcon />}
              subItems={[
                {
                  href: `/o/${orgId}/member/list`,
                  text: "List",
                  icon: <ListTreeIcon />,
                },
              ]}
            />
            <SidebarItem
              text="Billing"
              href={`/o/${orgId}/billing/subscription`}
              icon={<CreditCardIcon />}
              subItems={[
                {
                  href: `/o/${orgId}/billing/subscription`,
                  text: "Subscription",
                  icon: <CreditCardIcon />,
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
