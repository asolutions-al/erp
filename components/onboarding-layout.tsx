import { Progress } from "@/components/ui/progress"
import { ONBOARDING_STEPS } from "@/constants/consts"
import { CheckCircle } from "lucide-react"
import { Messages } from "next-intl"
import { getTranslations } from "next-intl/server"
import { PropsWithChildren } from "react"

const OnboardingProgress = async ({ step }: { step: OnboardingStepT }) => {
  const t = await getTranslations()
  const currentStepIndex = ONBOARDING_STEPS.findIndex(
    (stepKey) => stepKey === step
  )
  const progress = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100

  return (
    <div className="mx-auto mb-8 w-full max-w-2xl">
      <div className="mb-6">
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex justify-between">
        {ONBOARDING_STEPS.map((stepKey, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex

          return (
            <div
              key={stepKey}
              className="flex flex-col items-center text-center"
            >
              <div
                className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                      ? "border-2 border-primary bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                } `}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="space-y-1">
                <p
                  className={`text-sm font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}
                >
                  {t(`${stepKey}Label`)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(`${stepKey}Description`)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

type Props = PropsWithChildren<{
  step: OnboardingStepT
  title: keyof Messages
  description: keyof Messages
}>

const OnboardingLayout = async ({
  children,
  step,
  title,
  description,
}: Props) => {
  const t = await getTranslations()
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <OnboardingProgress step={step} />

        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              {t(title)}
            </h1>
            {description && (
              <p className="text-lg text-muted-foreground">{t(description)}</p>
            )}
          </div>

          <div className="rounded-lg border bg-card p-8">{children}</div>
        </div>
      </div>
    </div>
  )
}

export { OnboardingLayout }
