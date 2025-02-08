import { db } from "@/db/app/instance"
import { createAuthClient } from "@/db/auth/client"
import { getAuthRedirectUrl } from "@/lib/utils"
import {
  organization,
  orgMember,
  user as schUser,
  unit,
} from "@/orm/app/schema"
import { eq } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const t = await getTranslations()
  const { origin } = requestUrl

  const authClient = await createAuthClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()
  const userId = user?.id

  /**
   * If user is not present, redirect to authenticate page.
   * This should never happen, but just in case.
   * Possible reasons:
   * 1. User authentication was not successful
   * 2. Trying to access this page directly
   */
  if (!userId) return NextResponse.redirect(getAuthRedirectUrl())

  /**
   * Being an existing user means:
   * User creation process has been run at least once.
   * Therefore, We skip this process.
   */
  const existingUser = await db.query.user.findFirst({
    where: eq(schUser.id, userId),
  })

  if (existingUser) return NextResponse.redirect(`${origin}/o/list`)

  /**
   * Start onboarding process
   */
  try {
    const transRes = await db.transaction(async (tx) => {
      /**
       * 1. Create user
       */
      await tx.insert(schUser).values({
        id: userId, // use same id as auth user
        email: user.email!, // TODO: are we sure email is always present?
      })

      /**
       * 2. Create organization
       */
      const [orgRes] = await tx
        .insert(organization)
        .values({
          name: t("My organization"),
          description: t("My first organization"),
          ownerId: userId,
        })
        .returning({
          id: organization.id,
        })

      /**
       * 3. Create unit
       */
      const [unitRes] = await tx
        .insert(unit)
        .values({
          name: t("My unit"),
          description: t("My first unit"),
          orgId: orgRes.id,
        })
        .returning({
          id: unit.id,
        })

      /**
       * 3. add org member
       */
      await tx.insert(orgMember).values({
        userId,
        orgId: orgRes.id,
        role: "owner",
      })

      return {
        orgId: orgRes.id,
      }
    })

    /**
     * Start background tasks
     */

    try {
      /**
       * TODO:
       * 1. Send welcome email
       */

      /**
       * 2. Adjust default settings
       */
      db.update(schUser)
        .set({
          defaultOrgId: transRes.orgId,
        })
        .where(eq(schUser.id, userId))
    } catch (error) {
      console.error("Background tasks failed", error)
    }
  } catch (error) {
    console.error(error)
    // TODO: where to redirect?
    return NextResponse.redirect(origin)
  }

  return NextResponse.redirect(`${origin}/o/list`)
}
