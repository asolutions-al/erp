"use server"
import "server-only"

import { IS_DEV } from "@/constants/env"
import {
  getSubscriptionByOrgId,
  updateSubscription,
} from "@/db/app/actions/subscription"
import { getPlanById } from "@/db/auth/loaders"
import { cancelPayPalSub, createPayPalSubs } from "@/lib/paypal"
import { planId as planIdEnum } from "@/orm/app/schema"
import { getTranslations } from "next-intl/server"

/**
 * Creates a new subscription for an organization
 */
const createSubscription = async (
  orgId: string,
  planId: (typeof planIdEnum.enumValues)[number]
): Promise<
  ResT<{
    approvalUrl: string
  }>
> => {
  const t = await getTranslations()

  if (planId === "INVOICE-STARTER")
    return {
      success: null,
      error: {
        message: t("Cannot create a subscription for the starter plan"),
      },
    }

  const existing = await getSubscriptionByOrgId(orgId)

  if (!existing)
    return {
      success: null,
      error: {
        message: t("No subscription found for this organization"),
      },
    }

  // If the organization already has an active subscription, we cannot create a new one
  if (existing.status === "ACTIVE" && existing.plan !== "INVOICE-STARTER")
    return {
      success: null,
      error: { message: t("Organization already has an active subscription") },
    }

  // Get the plan details from the database to retrieve the PayPal plan ID
  const planData = await getPlanById(planId)

  if (!planData)
    return {
      success: null,
      error: { message: t("Invalid plan selected") },
    }

  // Create a new PayPal subscription
  const newSubRes = await createPayPalSubs(
    IS_DEV ? planData.paypalSandboxPlanId : planData.paypalPlanId,
    orgId // Use orgId as custom_id to link PayPal subscription to your org
  )

  if (newSubRes.error)
    return {
      error: newSubRes.error,
      success: null,
    }

  // Get the approval URL for the user to approve the new subscription
  const approvalUrl = newSubRes.success?.data.links?.find(
    (l) => l.rel === "approve"
  )?.href

  if (!approvalUrl)
    return {
      success: null,
      error: {
        message: t("Failed to get approval URL for new subscription"),
      },
    }

  return {
    success: {
      data: { approvalUrl },
    },
    error: null,
  }
}

/**
 * Cancels an active subscription
 */
const cancelSubscription = async (orgId: string): Promise<ResT<true>> => {
  const t = await getTranslations()
  const existing = await getSubscriptionByOrgId(orgId)

  if (!existing)
    return {
      success: null,
      error: {
        message: t("No subscription found for this organization"),
      },
    }

  if (existing.status !== "ACTIVE")
    return {
      success: null,
      error: { message: t("Subscription is not active") },
    }

  if (existing.plan === "INVOICE-STARTER")
    return {
      success: null,
      error: { message: t("Cannot cancel a free plan") },
    }

  if (!existing.externalSubscriptionId)
    return {
      success: null,
      error: { message: t("No external subscription ID found") },
    }

  return await cancelPayPalSub(existing.externalSubscriptionId)
}

const switchToStarterPlan = async (orgId: string): Promise<ResT<true>> => {
  const t = await getTranslations()

  const existing = await getSubscriptionByOrgId(orgId)

  if (!existing)
    return {
      success: null,
      error: {
        message: t("No subscription found for this organization"),
      },
    }

  if (existing.plan === "INVOICE-STARTER" && existing.status === "ACTIVE")
    return {
      success: null,
      error: { message: t("Starter plan is already active") },
    }

  if (existing.status === "ACTIVE")
    return {
      success: null,
      error: {
        message: t(
          "Cannot switch to starter plan while subscription is active"
        ),
      },
    }

  try {
    await updateSubscription({
      id: existing.id,
      values: {
        plan: "INVOICE-STARTER",
        status: "ACTIVE",
        externalSubscriptionId: null,
        paymentProvider: null,
      },
    })
  } catch (error) {
    return {
      success: null,
      error: { message: t("Failed to update subscription to starter plan") },
    }
  }

  return {
    success: { data: true },
    error: null,
  }
}

export { cancelSubscription, createSubscription, switchToStarterPlan }
