"use client"

import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Messages, useTranslations } from "use-intl"

type Props = {
  href: string
  text: keyof Messages
  icon: React.ReactNode
}

const SidebarItemSimple = (props: Props) => {
  const t = useTranslations()
  const pathname = usePathname()
  const { setOpenMobile, isMobile } = useSidebar()

  return (
    <SidebarMenuItem
      onClick={() => {
        if (isMobile) setOpenMobile(false)
      }}
    >
      <SidebarMenuButton
        tooltip={t(props.text)}
        asChild
        isActive={pathname === props.href}
        className="h-10 p-4"
      >
        <Link href={props.href}>
          {props.icon}
          <span className="font-semibold">{t(props.text)}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export { SidebarItemSimple }
