import { OnboardingOrgForm } from "@/components/forms"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { WithOnboardingStep } from "@/components/wrapper"
import { onBoardOrganizationStep } from "@/db/app/actions"
import { getUserId } from "@/db/auth/loaders"
import { OnboardingOrgFormProvider } from "@/providers"
import { getTranslations } from "next-intl/server"

type Props = {}

const step: OnboardingStepT = "organization"

const Page = async (props: Props) => {
  const t = await getTranslations()
  const userId = await getUserId()

  return (
    <WithOnboardingStep step={step}>
      <OnboardingLayout
        step={step}
        title="Create a new organization"
        description="Set up your company or organization details"
      >
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-muted-foreground">
              {t(
                "Your organization is the top-level entity that will contain all your business units, products, customers, and other data"
              )}
            </p>
          </div>

          <OnboardingOrgFormProvider>
            <OnboardingOrgForm
              performAction={async (values) => {
                "use server"

                await onBoardOrganizationStep({
                  values,
                  userId,
                })
              }}
            />
          </OnboardingOrgFormProvider>
        </div>
      </OnboardingLayout>
    </WithOnboardingStep>
  )
}

export default Page
