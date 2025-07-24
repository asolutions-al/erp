"use client"

import { signOut } from "@/db/auth/actions"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { LogOut } from "lucide-react"
import { useTranslations } from "next-intl"

const LogOutBtn = () => {
  const t = useTranslations()
  return (
    <DropdownMenuItem
      onClick={() => {
        signOut({ pathname: "/login" })
      }}
    >
      <LogOut />
      {t("Log out")}
    </DropdownMenuItem>
  )
}

export { LogOutBtn }
