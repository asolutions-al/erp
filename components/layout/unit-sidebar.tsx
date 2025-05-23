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
  ArrowLeftIcon,
  BanknoteIcon,
  BrickWallIcon,
  BriefcaseBusinessIcon,
  CirclePlusIcon,
  ContactIcon,
  LayoutDashboardIcon,
  ListTreeIcon,
  PackageIcon,
  ReceiptTextIcon,
  SettingsIcon,
  WarehouseIcon,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { PropsWithChildren, Suspense } from "react"
import { OrgSwitcher } from "../org-switcher"
import { UnitSwitcher } from "../unit-switcher"
import { SidebarUser } from "./sidebar-user"

type Props = PropsWithChildren<{
  params: Promise<GlobalParams>
}>

const UnitSidebar = async (props: Props) => {
  const t = await getTranslations()
  const { orgId, unitId } = await props.params

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Suspense fallback={<SwitcherSkeleton />}>
          <OrgSwitcher {...props} />
        </Suspense>
        <Suspense fallback={<SwitcherSkeleton />}>
          <UnitSwitcher {...props} />
        </Suspense>
        <Link href={`/o/${orgId}/unit/list`} passHref>
          <SidebarMenuButton>
            <ArrowLeftIcon />
            {t("Organization")}
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("Menu")}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarItem
              text="Overview"
              icon={<BrickWallIcon />}
              href={`/o/${orgId}/u/${unitId}/overview/dashboard/today`}
              subItems={[
                {
                  href: `/o/${orgId}/u/${unitId}/overview/dashboard/today`,
                  text: "Dashboard",
                  icon: <LayoutDashboardIcon />,
                },
              ]}
            />
            <SidebarItem
              text="Product"
              icon={<PackageIcon />}
              href={`/o/${orgId}/u/${unitId}/product/list/active`}
              subItems={[
                {
                  href: `/o/${orgId}/u/${unitId}/product/list/active`,
                  text: "List",
                  icon: <ListTreeIcon />,
                },
                {
                  href: `/o/${orgId}/u/${unitId}/product/create`,
                  text: "Create",
                  icon: <CirclePlusIcon />,
                },
              ]}
            />
            <SidebarItem
              text="Customer"
              icon={<ContactIcon />}
              href={`/o/${orgId}/u/${unitId}/customer/list/active`}
              subItems={[
                {
                  href: `/o/${orgId}/u/${unitId}/customer/list/active`,
                  text: "List",
                  icon: <ListTreeIcon />,
                },
                {
                  href: `/o/${orgId}/u/${unitId}/customer/create`,
                  text: "Create",
                  icon: <CirclePlusIcon />,
                },
              ]}
            />
            <SidebarItem
              text="Invoice"
              icon={<ReceiptTextIcon />}
              href={`/o/${orgId}/u/${unitId}/invoice/list/today`}
              subItems={[
                {
                  href: `/o/${orgId}/u/${unitId}/invoice/list/today`,
                  text: "List",
                  icon: <ListTreeIcon />,
                },
                {
                  href: `/o/${orgId}/u/${unitId}/invoice/create`,
                  text: "Create",
                  icon: <CirclePlusIcon />,
                },
              ]}
            />
            <SidebarItem
              text="Cash register"
              icon={<BanknoteIcon />}
              href={`/o/${orgId}/u/${unitId}/cashRegister/list/active`}
              subItems={[
                {
                  href: `/o/${orgId}/u/${unitId}/cashRegister/list/active`,
                  text: "List",
                  icon: <ListTreeIcon />,
                },
                {
                  href: `/o/${orgId}/u/${unitId}/cashRegister/create`,
                  text: "Create",
                  icon: <CirclePlusIcon />,
                },
              ]}
            />
            <SidebarItem
              text="Warehouse"
              icon={<WarehouseIcon />}
              href={`/o/${orgId}/u/${unitId}/warehouse/list/active`}
              subItems={[
                {
                  href: `/o/${orgId}/u/${unitId}/warehouse/list/active`,
                  text: "List",
                  icon: <ListTreeIcon />,
                },
                {
                  href: `/o/${orgId}/u/${unitId}/warehouse/create`,
                  text: "Create",
                  icon: <CirclePlusIcon />,
                },
              ]}
            />
            <SidebarItem
              text="Category"
              icon={<BriefcaseBusinessIcon />}
              href={`/o/${orgId}/u/${unitId}/category/list/active`}
              subItems={[
                {
                  href: `/o/${orgId}/u/${unitId}/category/list/active`,
                  text: "List",
                  icon: <ListTreeIcon />,
                },
                {
                  href: `/o/${orgId}/u/${unitId}/category/create`,
                  text: "Create",
                  icon: <CirclePlusIcon />,
                },
              ]}
            />
            <SidebarItem
              text="Configuration"
              icon={<SettingsIcon />}
              href={`/o/${orgId}/u/${unitId}/config/invoice`}
              subItems={[
                {
                  href: `/o/${orgId}/u/${unitId}/config/invoice`,
                  text: "Invoice",
                  icon: <ReceiptTextIcon />,
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

export { UnitSidebar }
