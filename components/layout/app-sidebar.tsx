"use client"

import { BookOpen, Package, ReceiptTextIcon } from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Suspense } from "react"
import { UnitSwitcher } from "../switchers/unit"

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
      {
        title: t("Invoice"),
        url: "#",
        icon: ReceiptTextIcon,
        isActive: true,
        items: [
          {
            title: t("List"),
            url: `/${unitId}/invoice/list`,
          },
          {
            title: t("Create"),
            url: `/${unitId}/invoice/create`,
          },
        ],
      },
    ],
  }
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Suspense>
          <UnitSwitcher
            units={[
              {
                createdAt: "2022-01-01",
                description: "Description",
                id: "c57a354e-18a1-4b7a-821a-088f554e53f9",
                name: "Name",
                orgId: "1",
              },
            ]}
          />
        </Suspense>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export { AppSidebar as AppSidebarNew }
