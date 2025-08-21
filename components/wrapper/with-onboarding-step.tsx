import { ONBOARDING_STEPS } from "@/constants/consts"
import { db } from "@/db/app/instance"
import { getUserId } from "@/db/auth/loaders"
import { user } from "@/orm/app/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  step: OnboardingStepT
}>

const WithOnboardingStep = async ({
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const userId = await getUserId()

  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
  })

  const step = ONBOARDING_STEPS[userData?.onboardingStep ?? 0]

  if (step !== props.step) redirect(`/onboarding/${step}`)

  return children
}

export { WithOnboardingStep }
