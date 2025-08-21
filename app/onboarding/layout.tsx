import { db } from "@/db/app/instance"
import { getUserId } from "@/db/auth/loaders/auth"
import { user } from "@/orm/app/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { PropsWithChildren } from "react"

const Layout = async ({ children }: PropsWithChildren) => {
  const userId = await getUserId()

  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
  })

  if (userData?.onboardingStep === -1) redirect("/")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">{children}</div>
    </div>
  )
}

export default Layout
