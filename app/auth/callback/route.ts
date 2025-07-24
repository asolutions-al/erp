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
  subscription,
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
   * This should never happen, possible reasons could be:
   * 1. User authentication was not successful
   * 2. Trying to access this route directly
   */
  if (!userId)
    return NextResponse.redirect(getAuthRedirectUrl({ pathname: "/login" }))

  const existingUser = await db.query.user.findFirst({
    where: eq(schUser.id, userId),
  })

  /**
   * Being an existing user means:
   * User creation process has been run at least once.
   * Therefore, We skip this process.
   */
  if (existingUser) return NextResponse.redirect(origin)

  /**
   * Start onboarding process
   */
  try {
    await db.transaction(async (tx) => {
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
          description: t("Demo description"),
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
          description: t("Demo description"),
          orgId: orgRes.id,
          status: "active",
        })
        .returning({
          id: unit.id,
        })

      const [[], [], [], [customerRes], [warehouseRes], [cashRegisterRes]] =
        await Promise.all([
          /**
           * 4. Update user with default org
           */
          tx
            .update(schUser)
            .set({
              defaultOrgId: orgRes.id,
            })
            .where(eq(schUser.id, userId)),
          /**
           * 5. Create org member
           */
          tx.insert(orgMember).values({
            userId,
            orgId: orgRes.id,
            role: "owner",
          }),
          /**
           * 6. Create product
           */
          tx.insert(product).values({
            orgId: orgRes.id,
            unitId: unitRes.id,
            name: t("Demo product"),
            description: t("Demo description"),
            unit: "XPP",
            price: 1,
            purchasePrice: 0.5,
            status: "active",
            isFavorite: false,
            taxPercentage: 0,
          }),
          /**
           * 7. Create customer
           */
          tx
            .insert(customer)
            .values({
              orgId: orgRes.id,
              unitId: unitRes.id,
              name: t("Demo customer"),
              description: t("Demo description"),
              status: "active",
              isFavorite: false,
              idType: "id",
            })
            .returning({
              id: customer.id,
            }),
          /**
           * 8. Create warehouse
           */
          tx
            .insert(warehouse)
            .values({
              name: t("Demo warehouse"),
              orgId: orgRes.id,
              unitId: unitRes.id,
              status: "active",
              isFavorite: false,
            })
            .returning({
              id: warehouse.id,
            }),
          /**
           * 9. Create cash register
           */
          tx
            .insert(cashRegister)
            .values({
              orgId: orgRes.id,
              unitId: unitRes.id,
              name: t("Demo cash register"),
              status: "active",
              isFavorite: false,
              balance: 0,
              isOpen: true,
              openedAt: new Date().toISOString(),
              openedBy: userId,
              openingBalance: 0,
            })
            .returning({
              id: cashRegister.id,
            }),

          /**
           * 10. Create subscription
           */
          tx.insert(subscription).values({
            orgId: orgRes.id,
            plan: "INVOICE-STARTER",
            status: "ACTIVE",
            paymentProvider: null,
            externalSubscriptionId: null,
          }),
        ])

      /**
       * 10. Create default invoice config
       */
      await tx.insert(invoiceConfig).values({
        unitId: unitRes.id,
        orgId: orgRes.id,
        payMethod: "cash",
        triggerCashOnInvoice: true,
        triggerInventoryOnInvoice: true,
        warehouseId: warehouseRes.id,
        customerId: customerRes.id,
        cashRegisterId: cashRegisterRes.id,
      })
    })
  } catch (error) {
    console.error(error)
    // TODO: where to redirect?
    return NextResponse.redirect(origin)
  }

  return NextResponse.redirect(origin)
}
