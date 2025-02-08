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
  BuildingIcon,
  ChevronRight,
  CirclePlusIcon,
  ContactIcon,
  HomeIcon,
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
import { OrgSwitcher } from "../org-switcher"
import { SidebarItem } from "../sidebar-item"
import { Skeleton } from "../ui/skeleton"
import { UnitSwitcher } from "../unit-switcher"
import { SidebarUser } from "./sidebar-user"
import Link from "next/link"

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
                  <SidebarMenuButton tooltip={t("Product")}>
                    <PackageIcon />
                    <span className="font-semibold">{t("Product")}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarItem
                      href={`/o/${orgId}/u/${unitId}/product/list/active`}
                      text="List"
                      icon={<ListTreeIcon />}
                    />
                    <SidebarItem
                      href={`/o/${orgId}/u/${unitId}/product/create`}
                      text="Create"
                      icon={<CirclePlusIcon />}
                    />
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
            <Collapsible asChild defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={t("Customer")}>
                    <ContactIcon />
                    <span className="font-semibold">{t("Customer")}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarItem
                      href={`/o/${orgId}/u/${unitId}/customer/list`}
                      text="List"
                      icon={<ListTreeIcon />}
                    />
                    <SidebarItem
                      href={`/o/${orgId}/u/${unitId}/customer/create`}
                      text="Create"
                      icon={<CirclePlusIcon />}
                    />
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
            <Collapsible asChild defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={t("Invoice")}>
                    <ReceiptTextIcon />
                    <span className="font-semibold">{t("Invoice")}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarItem
                      href={`/o/${orgId}/u/${unitId}/invoice/list`}
                      text="List"
                      icon={<ListTreeIcon />}
                    />
                    <SidebarItem
                      href={`/o/${orgId}/u/${unitId}/invoice/create`}
                      text="Create"
                      icon={<CirclePlusIcon />}
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

export { UnitSidebar }
