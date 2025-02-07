import { FileQuestion } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getTranslations } from "next-intl/server"
const NotFound = async () => {
  const t = await getTranslations()
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-4xl font-extrabold">
            <FileQuestion className="mr-2 h-12 w-12 text-primary" />
            404
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <h2 className="text-2xl font-semibold">{t("Page not found")}</h2>
            <p className="mt-2 text-sm">
              {t("We're sorry, the page you requested could not be found")}.
              {t("Please check the URL or try navigating back to the homepage")}
              .
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">{t("Return to homepage")}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NotFound
