"use client"

import { signOut } from "@/db/auth/actions"
import { LogOut } from "lucide-react"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { DropdownMenuItem } from "../ui/dropdown-menu"

const LogOutBtn = () => {
  const t = useTranslations()
  const returnTo = usePathname()

  return (
    <DropdownMenuItem onClick={() => signOut({ returnTo, page: "/login" })}>
      <LogOut />
      {t("Log out")}
    </DropdownMenuItem>
  )
}

export { LogOutBtn }
