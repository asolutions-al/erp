import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { createAuthClient } from "@/db/auth/client"
import { InfoIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

const DemoBanner = async () => {
  const t = await getTranslations()
  const client = await createAuthClient()
  const { data } = await client.auth.getUser()

  const email = data.user?.email || ""

  // Only show banner for demo account
  if (email !== "demo@asolutions.al") {
    return null
  }

  return (
    <div className="mx-1.5 mt-1.5 md:mx-2 md:mt-2 lg:mx-2.5 lg:mt-2.5">
      <Alert className="border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100">
        <InfoIcon className="h-4 w-4" />
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <AlertTitle>{t("Demo Account")}</AlertTitle>
            <AlertDescription>
              {t("You are currently using a demo account")}.{" "}
              {t("All data and changes are for demonstration purposes only")}.
            </AlertDescription>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="ml-4 shrink-0 border-blue-300 bg-white text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
          >
            <Link href="/signup">{t("Sign Up")}</Link>
          </Button>
        </div>
      </Alert>
    </div>
  )
}

export { DemoBanner }
