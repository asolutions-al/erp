"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "@/db/auth/actions"
import { HomeIcon, LogInIcon, UserPlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NotFoundBtns = () => {
  const t = useTranslations()
  const returnTo = usePathname()
  return (
    <div className="space-y-1">
      <Button
        className="w-full"
        size="lg"
        onClick={() => signOut({ returnTo, page: "/login" })}
      >
        <LogInIcon />
        {t("Sign in to your account")}
      </Button>
      <Button
        variant="outline"
        className="w-full"
        size="lg"
        onClick={() => signOut({ returnTo, page: "/signup" })}
      >
        <UserPlusIcon />
        {t("Create a new account")}
      </Button>
      <Link href="/">
        <Button variant="ghost" className="w-full" size="lg">
          <HomeIcon />
          {t("Go to homepage")}
        </Button>
      </Link>
    </div>
  )
}

export { NotFoundBtns }
