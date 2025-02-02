"use client"

import { Messages } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "use-intl"
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "./ui/sidebar"

type Props = {
  href: string
  text: keyof Messages
}

const SidebarItem = (props: Props) => {
  const t = useTranslations()
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const isActive = pathname === props.href
  return (
    <SidebarMenuSubItem onClick={() => setOpenMobile(false)}>
      <SidebarMenuSubButton asChild isActive={isActive}>
        <Link
          href={{
            pathname: props.href,
          }}
        >
          <span>{t(props.text)}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

export { SidebarItem }
