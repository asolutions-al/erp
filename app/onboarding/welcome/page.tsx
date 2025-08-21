import { OnboardingWelcomeForm } from "@/components/forms"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { WithOnboardingStep } from "@/components/wrapper"
import { onBoardWelcomeStep } from "@/db/app/actions"
import { createAuthClient } from "@/db/auth/client"
import { OnboardingWelcomeFormProvider } from "@/providers"
import { getTranslations } from "next-intl/server"
import { redirect } from "next/navigation"

const step: OnboardingStepT = "welcome"

const Page = async () => {
  const t = await getTranslations()
  const authClient = await createAuthClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()

  if (!user) redirect("/")

  const email = user.email!

  return (
    <WithOnboardingStep step={step}>
      <OnboardingLayout
        step={step}
        title="Welcome to your ERP System"
        description="Let's get you set up with your account"
      >
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-muted-foreground">
              {t(
                "We're excited to help you manage your business more effectively"
              )}
              .{t("Let's start by setting up your account")}.
            </p>
          </div>

          <OnboardingWelcomeFormProvider
            defaultValues={{
              displayName:
                email.at(0)?.toUpperCase() + email.split("@")[0].slice(1),
            }}
          >
            <OnboardingWelcomeForm
              performAction={async (values) => {
                "use server"
                await onBoardWelcomeStep({
                  values,
                  userId: user.id,
                  email,
                })
              }}
              user={{ email }}
            />
          </OnboardingWelcomeFormProvider>
        </div>
      </OnboardingLayout>
    </WithOnboardingStep>
  )
}

export default Page
