"use server"
import "server-only"

import { getSubscriptionByOrgId } from "@/db/app/actions/subscription"
import { getPlanById } from "@/db/auth/loaders"
import { cancelPayPalSub, createPayPalSubs } from "@/lib/paypal"
import { planId as planIdEnum } from "@/orm/app/schema"

const isDev = process.env.NODE_ENV === "development"

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
  // Check if organization already has a subscription
  const existingSub = await getSubscriptionByOrgId(orgId)

  if (!existingSub) {
    return {
      success: null,
      error: {
        message:
          "No existing subscription found for this organization. This should not happen. Please contact support.",
      },
    }
  }

  // If the organization already has an active subscription, do not allow creating a new one
  // unless they are upgrading from the free plan
  if (
    existingSub.status === "ACTIVE" &&
    existingSub.plan !== "INVOICE-STARTER"
  ) {
    return {
      success: null,
      error: { message: "Organization already has an active subscription" },
    }
  }

  // Get the plan details from the database to retrieve the PayPal plan ID
  const planData = await getPlanById(planId)

  if (!planData) {
    return {
      success: null,
      error: { message: "Invalid plan selected" },
    }
  }

  // Create a new PayPal subscription
  const newSubscriptionData = await createPayPalSubs(
    isDev ? planData.paypalSandboxPlanId : planData.paypalPlanId,
    orgId // Use orgId as custom_id to link PayPal subscription to your org
  )

  if (!newSubscriptionData.success) {
    return {
      success: null,
      error: { message: "Failed to create new subscription" },
    }
  }

  // Get the approval URL for the user to approve the new subscription
  const approvalUrl = newSubscriptionData.success.data.links?.find(
    (l) => l.rel === "approve"
  )?.href

  if (!approvalUrl) {
    return {
      success: null,
      error: {
        message: "Failed to get approval URL for new subscription",
      },
    }
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
  const subscription = await getSubscriptionByOrgId(orgId)

  if (!subscription)
    return {
      success: null,
      error: { message: "No subscription found for this organization" },
    }

  if (subscription.status !== "ACTIVE")
    return {
      success: null,
      error: { message: "Subscription is not active" },
    }

  if (subscription.plan === "INVOICE-STARTER") {
    return {
      success: null,
      error: { message: "Cannot cancel a free plan" },
    }
  }

  if (!subscription.externalSubscriptionId)
    return {
      success: null,
      error: { message: "No external subscription ID found" },
    }

  return await cancelPayPalSub(subscription.externalSubscriptionId)
}

export { cancelSubscription, createSubscription }
