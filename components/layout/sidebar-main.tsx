import {
  BookOpenIcon,
  ContactIcon,
  PackageIcon,
  ReceiptTextIcon,
} from "lucide-react"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

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
  return (
    <SidebarGroup>
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
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            // @ts-ignore
                            href={subItem.url}
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

const OrgNav = async ({ orgId }: { orgId: string }) => {
  const t = await getTranslations()
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
              url: `/org/${orgId}/~/list`,
            },
            {
              title: t("Create"),
              url: `/org/${orgId}/~/create`,
            },
          ],
        },
      ]}
    />
  )
}

const UnitNav = async ({
  orgId,
  unitId,
}: {
  orgId: string
  unitId: string
}) => {
  const t = await getTranslations()

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
              url: `/org/${orgId}/${unitId}/dashboard`,
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
              url: `/org/${orgId}/${unitId}/product/list`,
            },
            {
              title: t("Create"),
              url: `/org/${orgId}/${unitId}/product/create`,
            },
          ],
        },
        {
          title: t("Customer"),
          url: "#",
          icon: ContactIcon,
          isActive: true,
          items: [
            {
              title: t("List"),
              url: `/org/${orgId}/${unitId}/customer/list`,
            },
            {
              title: t("Create"),
              url: `/org/${orgId}/${unitId}/customer/create`,
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
              url: `/org/${orgId}/${unitId}/invoice/list`,
            },
            {
              title: t("Create"),
              url: `/org/${orgId}/${unitId}/invoice/create`,
            },
          ],
        },
      ]}
    />
  )
}

const SidebarMain = ({ orgId, unitId }: { orgId: string; unitId?: string }) => {
  return unitId ? (
    <UnitNav orgId={orgId} unitId={unitId} />
  ) : (
    <OrgNav orgId={orgId} />
  )
}

export { SidebarMain }
