"use client"

import { BookOpen, Package } from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"

const AppSidebar = () => {
  const t = useTranslations()
  const { unitId } = useParams()

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
            url: `/${unitId}/dashboard`,
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
            url: `/${unitId}/product/list`,
          },
          {
            title: t("Create"),
            url: `/${unitId}/product/create`,
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
