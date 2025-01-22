"use client" // TODO: convert to "server" component

import { BookOpenIcon, PackageIcon, ReceiptTextIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
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
                    const isActive = pathname === subItem.url
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={isActive}>
                          <Link
                            // @ts-ignore
                            href={subItem.url}
                            onClick={() => setOpenMobile(false)}
                          >
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
  )
}

const OrgNav = () => {
  const t = useTranslations()
  const { orgId, unitId } = useParams<{ orgId: string; unitId?: string }>()

  return (
    <NavMain
      items={[
        {
          title: t("Unit"),
          url: "#",
          icon: BookOpenIcon,
          isActive: true,
          items: [
            {
              title: t("List"),
              url: `/org/${orgId}/unit/list`,
            },
            {
              title: t("Create"),
              url: `/org/${orgId}/unit/create`,
            },
          ],
        },
      ]}
    />
  )
}

const UnitNav = () => {
  const t = useTranslations()
  const { orgId, unitId } = useParams<{ orgId: string; unitId?: string }>()

  return (
    <NavMain
      items={[
        {
          title: t("History"),
          url: "#",
          icon: BookOpenIcon,
          isActive: true,
          items: [
            {
              title: t("Dashboard"),
              url: `/org/${orgId}/unit/${unitId}/dashboard`,
            },
          ],
        },
        {
          title: t("Product"),
          url: "#",
          icon: PackageIcon,
          isActive: true,
          items: [
            {
              title: t("List"),
              url: `/org/${orgId}/unit/${unitId}/product/list`,
            },
            {
              title: t("Create"),
              url: `/org/${orgId}/unit/${unitId}/product/create`,
            },
          ],
        },
        {
          title: t("Invoice"),
          url: "#",
          icon: ReceiptTextIcon,
          isActive: true,
          items: [
            {
              title: t("List"),
              url: `/org/${orgId}/unit/${unitId}/invoice/list`,
            },
            {
              title: t("Create"),
              url: `/org/${orgId}/unit/${unitId}/invoice/create`,
            },
          ],
        },
      ]}
    />
  )
}

const SidebarMain = () => {
  const { unitId } = useParams<{ unitId?: string }>()

  return unitId ? <UnitNav /> : <OrgNav />
}

export { SidebarMain }
