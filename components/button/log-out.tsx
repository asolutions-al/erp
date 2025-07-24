"use client"

import { signOut } from "@/db/auth/actions"
import { LogOut } from "lucide-react"
import { useTranslations } from "next-intl"
import { DropdownMenuItem } from "../ui/dropdown-menu"

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
