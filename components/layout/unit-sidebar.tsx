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
  ArrowLeftIcon,
  BanknoteIcon,
  BriefcaseBusinessIcon,
  ContactIcon,
  LayoutDashboardIcon,
  PackageIcon,
  PlusCircleIcon,
  ReceiptTextIcon,
  SettingsIcon,
  WarehouseIcon,
  ZapIcon,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { PropsWithChildren, Suspense } from "react"
import { OrgSwitcher } from "../org-switcher"
import { UnitSwitcher } from "../unit-switcher"
import { SidebarUser } from "./sidebar-user"

type Props = PropsWithChildren<{
  params: Promise<GlobalParamsT>
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
        <Link href={`/o/${orgId}/overview`} passHref>
          <SidebarMenuButton>
            <ArrowLeftIcon />
            {t("Organization")}
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <ZapIcon className="mr-1" />
            {t("Quick actions")}
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarItemSimple
              text="New invoice"
              icon={<PlusCircleIcon />}
              href={`/o/${orgId}/u/${unitId}/invoice/create`}
            />
            <SidebarItemSimple
              text="New product"
              icon={<PlusCircleIcon />}
              href={`/o/${orgId}/u/${unitId}/product/create`}
            />
            <SidebarItemSimple
              text="New customer"
              icon={<PlusCircleIcon />}
              href={`/o/${orgId}/u/${unitId}/customer/create`}
            />
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            <PackageIcon className="mr-1" />
            {t("Menu")}
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarItemSimple
              text="Dashboard"
              icon={<LayoutDashboardIcon />}
              href={`/o/${orgId}/u/${unitId}/overview/dashboard/today`}
            />
            <SidebarItemSimple
              text="Products"
              icon={<PackageIcon />}
              href={`/o/${orgId}/u/${unitId}/product/list/active`}
            />
            <SidebarItemSimple
              text="Customers"
              icon={<ContactIcon />}
              href={`/o/${orgId}/u/${unitId}/customer/list/active`}
            />
            <SidebarItemSimple
              text="Invoices"
              icon={<ReceiptTextIcon />}
              href={`/o/${orgId}/u/${unitId}/invoice/list/today`}
            />
            <SidebarItemSimple
              text="Cash registers"
              icon={<BanknoteIcon />}
              href={`/o/${orgId}/u/${unitId}/cashRegister/list/active`}
            />
            <SidebarItemSimple
              text="Warehouses"
              icon={<WarehouseIcon />}
              href={`/o/${orgId}/u/${unitId}/warehouse/list/active`}
            />
            <SidebarItemSimple
              text="Categories"
              icon={<BriefcaseBusinessIcon />}
              href={`/o/${orgId}/u/${unitId}/category/list/active`}
            />
            <SidebarItemSimple
              text="Configurations"
              icon={<SettingsIcon />}
              href={`/o/${orgId}/u/${unitId}/config/invoice`}
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
