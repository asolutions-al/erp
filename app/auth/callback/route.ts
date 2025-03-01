import { db } from "@/db/app/instance"
import { createAuthClient } from "@/db/auth/client"
import { getAuthRedirectUrl } from "@/lib/utils"
import {
  cashRegister,
  customer,
  invoiceConfig,
  organization,
  orgMember,
  product,
  user as schUser,
  unit,
  warehouse,
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
          name: t("Demo organization"),
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
          name: t("Demo unit"),
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
        unitId: unitRes.id,
      }
    })

    /**
     * Start background tasks
     */
    const backgroundTasks = async () =>
      await Promise.all([
        /**
         * TODO:
         * 1. Send welcome email
         */
        /**
         * 2. Update default orgId for user
         */
        db
          .update(schUser)
          .set({
            defaultOrgId: transRes.orgId,
          })
          .where(eq(schUser.id, userId)),
        /**
         * 3. Create default invoice config
         */
        db.insert(invoiceConfig).values({
          unitId: transRes.unitId,
          orgId: transRes.orgId,
          payMethod: "cash",
          triggerCashOnInvoice: true,
          triggerInventoryOnInvoice: true,
        }),
        /**
         * 3. Create warehouse
         */
        db.insert(warehouse).values({
          name: t("Demo warehouse"),
          orgId: transRes.orgId,
          unitId: transRes.unitId,
          status: "active",
          isFavorite: false,
        }),
        /**
         * 4. Create cash register
         */
        db.insert(cashRegister).values({
          orgId: transRes.orgId,
          unitId: transRes.unitId,
          name: t("Demo cash register"),
          status: "active",
          isFavorite: false,
          balance: 0,
          isOpen: true,
          openedAt: new Date().toISOString(),
          openedBy: userId,
          openingBalance: 0,
        }),
        /**
         * 5. Create product
         */
        db.insert(product).values({
          orgId: transRes.orgId,
          unitId: transRes.unitId,
          name: t("Demo product"),
          unit: "XPP",
          price: 1,
          status: "active",
          isFavorite: false,
          taxType: "0",
        }),
        /**
         * 6. Create customer
         */
        db.insert(customer).values({
          orgId: transRes.orgId,
          unitId: transRes.unitId,
          name: t("Demo customer"),
          status: "active",
          isFavorite: false,
          idType: "id",
        }),
      ])

    backgroundTasks()
  } catch (error) {
    console.error(error)
    // TODO: where to redirect?
    return NextResponse.redirect(origin)
  }

  return NextResponse.redirect(`${origin}/o/list`)
}
