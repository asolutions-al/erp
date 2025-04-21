"use client"

import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { SettingsIcon } from "lucide-react"
import Link from "next/link"
import { useSidebar } from "../ui/sidebar"

const SidebarUserSetting = () => {
  const { setOpenMobile, isMobile } = useSidebar()

  return (
    <Link href="/account/settings/general" passHref>
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => {
            if (isMobile) setOpenMobile(false)
          }}
        >
          <SettingsIcon />
          Settings
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </Link>
  )
}

export { SidebarUserSetting }
