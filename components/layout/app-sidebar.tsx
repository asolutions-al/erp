"use client"

import { BookOpen, Package, ReceiptTextIcon } from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"

const AppSidebar = () => {
  const t = useTranslations()
  const { orgId, unitId } = useParams<{ orgId: string; unitId?: string }>()

  if (!unitId) return null // TODO: add org sidebar

  const data = {
    navMain: [
      {
        title: t("History"),
        url: "#",
        icon: BookOpen,
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
        icon: Package,
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
    ],
  }
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export { AppSidebar as AppSidebarNew }
