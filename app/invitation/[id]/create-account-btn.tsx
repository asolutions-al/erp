"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "@/db/auth/actions"
import { UserPlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"

const CreateAccountBtn = () => {
  const t = useTranslations()
  const returnTo = usePathname()
  return (
    <Button
      variant="outline"
      className="w-full"
      size="lg"
      onClick={() => signOut({ returnTo, page: "/signup" })}
    >
      <UserPlusIcon />
      {t("Create an account")}
    </Button>
  )
}

export { CreateAccountBtn }
