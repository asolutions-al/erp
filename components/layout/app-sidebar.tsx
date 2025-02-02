import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  BuildingIcon,
  ChevronRight,
  ContactIcon,
  PackageIcon,
  ReceiptTextIcon,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { PropsWithChildren, Suspense } from "react"
import { OrgSwitcher } from "../org-switcher"
import { Skeleton } from "../ui/skeleton"
import { UnitSwitcher } from "../unit-switcher"
import { SidebarUser } from "./sidebar-user"

const OrgContent = async ({ orgId }: { orgId: string }) => {
  const t = await getTranslations()
  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>{t("Organization")}</SidebarGroupLabel> */}
      <SidebarMenu>
        <Collapsible asChild defaultOpen className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={t("Unit")}>
                <BuildingIcon />
                <span>{t("Unit")}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href={`/org/${orgId}/~/list`}>
                      <span>{t("List")}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href={`/org/${orgId}/~/create`}>
                      <span>{t("Create")}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}

const UnitContent = async ({
  orgId,
  unitId,
}: {
  orgId: string
  unitId: string
}) => {
  const t = await getTranslations()

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>{t("Unit")}</SidebarGroupLabel> */}
      <SidebarMenu>
        <Collapsible asChild defaultOpen className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={t("Product")}>
                <PackageIcon />
                <span>{t("Product")}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href={`/org/${orgId}/${unitId}/product/list`}>
                      <span>{t("List")}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href={`/org/${orgId}/${unitId}/product/create`}>
                      <span>{t("Create")}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
        <Collapsible asChild defaultOpen className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={t("Customer")}>
                <ContactIcon />
                <span>{t("Customer")}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href={`/org/${orgId}/${unitId}/customer/list`}>
                      <span>{t("List")}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href={`/org/${orgId}/${unitId}/customer/create`}>
                      <span>{t("Create")}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
        <Collapsible asChild defaultOpen className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={t("Invoice")}>
                <ReceiptTextIcon />
                <span>{t("Invoice")}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href={`/org/${orgId}/${unitId}/invoice/list`}>
                      <span>{t("List")}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href={`/org/${orgId}/${unitId}/invoice/create`}>
                      <span>{t("Create")}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
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

const Content = ({ orgId, unitId }: { orgId: string; unitId?: string }) => {
  return unitId ? (
    <UnitContent orgId={orgId} unitId={unitId} />
  ) : (
    <OrgContent orgId={orgId} />
  )
}

type Props = PropsWithChildren<{
  params: Promise<GlobalParams>
}>

const AppSidebar = async (props: Props) => {
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
      </SidebarHeader>
      <SidebarContent>
        <Content orgId={orgId} unitId={unitId === "~" ? undefined : unitId} />
      </SidebarContent>
      <Suspense>
        <SidebarUser />
      </Suspense>
      <SidebarRail />
    </Sidebar>
  )
}

export { AppSidebar }
