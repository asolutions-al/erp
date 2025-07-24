"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "@/db/auth/actions"
import { useTranslations } from "next-intl"

const DemoBannerCtaBtn = () => {
  const t = useTranslations()

  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-4 shrink-0 border-blue-300 bg-white text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
      onClick={() => {
        signOut({ pathname: "/signup" })
      }}
    >
      {t("Sign Up")}
    </Button>
  )
}

export { DemoBannerCtaBtn }
