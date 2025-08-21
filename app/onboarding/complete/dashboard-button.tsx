"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, LoaderIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"

const DashboardBtn = ({ onComplete }: { onComplete: () => Promise<void> }) => {
  const t = useTranslations()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleComplete = async () => {
    try {
      setIsLoading(true)
      await onComplete()
      await router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleComplete}
      disabled={isLoading}
      className="min-w-48"
      size="lg"
    >
      {isLoading ? <LoaderIcon className="animate-spin" /> : <ArrowRight />}
      {t("Go to dashboard")}
    </Button>
  )
}

export { DashboardBtn }
