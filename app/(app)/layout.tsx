import { db } from "@/db/app/instance"
import { getUserId } from "@/db/auth/loaders"
import { user } from "@/orm/app/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { PropsWithChildren } from "react"

const AppLayout = async ({ children }: PropsWithChildren) => {
  const userId = await getUserId()

  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
  })

  if (!userData || userData.onboardingStep !== -1)
    redirect("/onboarding/welcome")

  return children
}

export default AppLayout
