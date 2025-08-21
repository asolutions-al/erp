import { OnboardingUnitForm } from "@/components/forms"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { WithOnboardingStep } from "@/components/wrapper"
import { onBoardUnitStep } from "@/db/app/actions"
import { getUserId } from "@/db/auth/loaders/auth"
import { OnboardingUnitFormProvider } from "@/providers"
import { getTranslations } from "next-intl/server"

type Props = {}

const step: OnboardingStepT = "unit"

const Page = async (props: Props) => {
  const t = await getTranslations()
  const userId = await getUserId()

  return (
    <WithOnboardingStep step={step}>
      <OnboardingLayout
        step={step}
        title="Create your first unit"
        description="Set up your first business unit or department"
      >
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-muted-foreground">
              {t(
                "Business units help you organize different departments, stores, or locations within your organization"
              )}
              . {t("You can add more units later")}.
            </p>
          </div>

          <OnboardingUnitFormProvider>
            <OnboardingUnitForm
              performAction={async (values) => {
                "use server"

                await onBoardUnitStep({
                  values,
                  userId,
                })
              }}
            />
          </OnboardingUnitFormProvider>
        </div>
      </OnboardingLayout>
    </WithOnboardingStep>
  )
}

export default Page
