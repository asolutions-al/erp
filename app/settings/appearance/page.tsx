import { Separator } from "@/components/ui/separator"
import { getTranslations } from "next-intl/server"
import { AppearanceForm } from "./appearance-form"

const Page = async () => {
  const t = await getTranslations()
  return (
    <div className="m-4 space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("Appearance")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("Customize the appearance of the app")}.
        </p>
      </div>
      <Separator />
      <AppearanceForm />
    </div>
  )
}

export default Page
