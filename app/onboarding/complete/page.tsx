import { OnboardingLayout } from "@/components/onboarding-layout"
import { WithOnboardingStep } from "@/components/wrapper"
import { onBoardCompleteStep } from "@/db/app/actions"
import { getUserId } from "@/db/auth/loaders"
import { CheckCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { DashboardBtn } from "./dashboard-button"

type Props = {}

const step: OnboardingStepT = "complete"

const Page = async (props: Props) => {
  const t = await getTranslations()
  const userId = await getUserId()

  return (
    <WithOnboardingStep step={step}>
      <OnboardingLayout
        step={step}
        title="Setup Complete!"
        description="You're all set to start using your ERP system"
      >
        <div className="space-y-6">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <div className="space-y-2">
              <p className="text-lg text-muted-foreground">
                {t("Congratulations!")} {t("Your ERP system is ready to use")}.
              </p>
              <p className="text-sm text-muted-foreground">
                {t(
                  "You can now start managing your business with our comprehensive tools"
                )}
                .
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-lg bg-muted p-6">
            <h3 className="font-medium">{t("What's next?")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>
                  {t("Explore your dashboard to see business insights")}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>
                  {t("Add more products, customers, and suppliers as needed")}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>{t("Create your first invoice to start selling")}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>{t("Set up inventory tracking in your warehouse")}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>{t("Invite team members to collaborate")}</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 text-center">
            <DashboardBtn
              onComplete={async () => {
                "use server"

                await onBoardCompleteStep({ userId })
              }}
            />
          </div>
        </div>
      </OnboardingLayout>
    </WithOnboardingStep>
  )
}

export default Page
