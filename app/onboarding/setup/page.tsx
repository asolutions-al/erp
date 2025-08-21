import { OnboardingSetupForm } from "@/components/forms"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { WithOnboardingStep } from "@/components/wrapper"
import { onBoardSetupStep } from "@/db/app/actions"
import { getUserId } from "@/db/auth/loaders/auth"
import { OnboardingSetupFormProvider } from "@/providers"
import { getTranslations } from "next-intl/server"

type Props = {}

const step: OnboardingStepT = "setup"

const Page = async (props: Props) => {
  const t = await getTranslations()
  const userId = await getUserId()

  return (
    <WithOnboardingStep step={step}>
      <OnboardingLayout
        step={step}
        title="Initial Data Setup"
        description="Add your first product, customer, and other essential data"
      >
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-muted-foreground">
              {t("Let's add some initial data to get you started")}.{" "}
              {t("You can always modify or add more later")}.
            </p>
          </div>

          <OnboardingSetupFormProvider>
            <OnboardingSetupForm
              performAction={async (values) => {
                "use server"
                await onBoardSetupStep({
                  values,
                  userId,
                })
              }}
            />
          </OnboardingSetupFormProvider>
        </div>
      </OnboardingLayout>
    </WithOnboardingStep>
  )
}

export default Page
