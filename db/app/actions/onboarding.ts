"use server"

import { ONBOARDING_STEPS } from "@/constants/consts"
import { APP_URL } from "@/constants/env"
import { db } from "@/db/app/instance"
import { sendWelcomeEmail } from "@/lib/resend"
import {
  customer,
  invoiceConfig,
  organization,
  orgMember,
  product,
  subscription,
  supplier,
  unit,
  user,
  warehouse,
} from "@/orm/app/schema"
import {
  OnboardingOrgFormSchemaT,
  OnboardingSetupFormSchemaT,
  OnboardingUnitFormSchemaT,
  OnboardingWelcomeFormSchemaT,
} from "@/providers"
import { eq } from "drizzle-orm"

const _getNextStep = (step: OnboardingStepT) =>
  ONBOARDING_STEPS.indexOf(step) + 1

const onBoardWelcomeStep = async ({
  values,
  userId,
  email,
}: {
  values: OnboardingWelcomeFormSchemaT
  userId: string
  email: string
}) => {
  await db.insert(user).values({
    ...values,
    id: userId,
    email,
    onboardingStep: _getNextStep("welcome"),
    /**
     * This is a dummy uuid, its intentional since it will be updated in the next step
     */
    defaultOrgId: "00000000-0000-0000-0000-000000000000",
  })
}

const onBoardOrganizationStep = async ({
  values,
  userId,
}: {
  values: OnboardingOrgFormSchemaT
  userId: string
}) => {
  await db.transaction(async (tx) => {
    const [orgRes] = await tx
      .insert(organization)
      .values({
        ...values,
        ownerId: userId,
      })
      .returning({
        id: organization.id,
      })

    await tx.insert(orgMember).values({
      userId,
      orgId: orgRes.id,
      role: "owner",
    })

    await tx
      .update(user)
      .set({
        defaultOrgId: orgRes.id,
        onboardingStep: _getNextStep("organization"),
      })
      .where(eq(user.id, userId))
  })
}

const onBoardUnitStep = async ({
  values,
  userId,
}: {
  values: OnboardingUnitFormSchemaT
  userId: string
}) => {
  await db.transaction(async (tx) => {
    const userData = await tx.query.user.findFirst({
      where: eq(user.id, userId),
    })

    await tx.insert(unit).values({
      ...values,
      orgId: userData!.defaultOrgId!,
      status: "active",
    })

    await tx
      .update(user)
      .set({
        onboardingStep: _getNextStep("unit"),
      })
      .where(eq(user.id, userId))
  })
}

const onBoardSetupStep = async ({
  values,
  userId,
}: {
  values: OnboardingSetupFormSchemaT
  userId: string
}) => {
  if (!values.createSampleData) {
    await db
      .update(user)
      .set({
        onboardingStep: _getNextStep("setup"),
      })
      .where(eq(user.id, userId))
    return
  }

  const userRes = await db.query.user.findFirst({
    where: eq(user.id, userId),
  })

  if (!userRes) return

  const unitRes = await db.query.unit.findFirst({
    where: eq(unit.orgId, userRes.defaultOrgId),
  })

  if (!unitRes) return

  /**
   * Start onboarding process
   */
  await db.transaction(async (tx) => {
    /**
     * 1. Create product
     */
    await tx.insert(product).values({
      ...values.product,
      orgId: userRes.defaultOrgId,
      unitId: unitRes.id,
      description: null,
      purchasePrice: 0,
      status: "active",
      isFavorite: false,
      taxPercentage: 0,
    })
    /**
     * 2. Create customer
     */
    const [customerRes] = await tx
      .insert(customer)
      .values({
        ...values.customer,
        orgId: userRes.defaultOrgId,
        unitId: unitRes.id,
        description: null,
        status: "active",
        isFavorite: false,
        idType: "id",
      })
      .returning({
        id: customer.id,
      })
    /**
     * 3. Create supplier
     */
    await tx
      .insert(supplier)
      .values({
        ...values.supplier,
        orgId: userRes.defaultOrgId,
        unitId: unitRes.id,
        description: null,
        status: "active",
        isFavorite: false,
        idType: "id",
      })
      .returning({
        id: supplier.id,
      })
    /**
     * 4. Create warehouse
     */
    const [warehouseRes] = await tx
      .insert(warehouse)
      .values({
        ...values.warehouse,
        orgId: userRes.defaultOrgId,
        unitId: unitRes.id,
        status: "active",
        isFavorite: false,
      })
      .returning({
        id: warehouse.id,
      })
    /**
     * 5. Create subscription
     */
    await tx.insert(subscription).values({
      orgId: userRes.defaultOrgId,
      plan: "INVOICE-STARTER",
      status: "ACTIVE",
      paymentProvider: null,
      externalSubscriptionId: null,
    })
    /**
     * 6. Create default invoice config
     */
    await tx.insert(invoiceConfig).values({
      unitId: unitRes.id,
      orgId: userRes.defaultOrgId,
      payMethod: "cash",
      triggerCashOnInvoice: true,
      triggerInventoryOnInvoice: true,
      warehouseId: warehouseRes.id,
      customerId: customerRes.id,
      cashRegisterId: null,
    })

    /**
     * 7. Update user onboarding step
     */
    await tx
      .update(user)
      .set({
        onboardingStep: _getNextStep("setup"),
      })
      .where(eq(user.id, userId))
  })
}

const onBoardCompleteStep = async ({ userId }: { userId: string }) => {
  const [userData] = await db
    .update(user)
    .set({
      onboardingStep: -1, // -1, means completed
    })
    .where(eq(user.id, userId))
    .returning()

  try {
    const orgData = await db.query.organization.findFirst({
      where: eq(organization.id, userData.defaultOrgId),
    })

    if (!orgData) return

    await sendWelcomeEmail({
      displayName: userData.displayName,
      email: userData.email,
      orgName: orgData.name,
      loginUrl: `${APP_URL}/o/${orgData.id}`,
    })
  } catch (error) {
    console.warn("Failed to send welcome email:", error)
  }
}

export {
  onBoardCompleteStep,
  onBoardOrganizationStep,
  onBoardSetupStep,
  onBoardUnitStep,
  onBoardWelcomeStep,
}
