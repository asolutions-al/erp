"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "@/db/auth/actions"
import { LogInIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"

const DifferentAccountBtn = () => {
  const t = useTranslations()
  const returnTo = usePathname()
  return (
    <Button
      className="w-full"
      size="lg"
      onClick={() => signOut({ returnTo, page: "/login" })}
    >
      <LogInIcon />
      {t("Sign in with a different email")}
    </Button>
  )
}

export { DifferentAccountBtn as DifferentAccountBtn }
