"use server"

import {
  getSubscriptionByOrgId,
  updateSubscription,
} from "@/db/app/actions/subscription"
import { getPlanById } from "@/db/auth/loaders"
import {
  cancelPayPalSub,
  createPayPalSubs,
  revisePayPalSub,
} from "@/lib/paypal"
import { plan } from "@/orm/auth/schema"

/**
 * Reactivates a cancelled subscription by creating a new PayPal subscription
 */
const reactivateSubscription = async (
  orgId: string
): Promise<
  ResT<{
    approvalUrl: string
  }>
> => {
  const subscription = await getSubscriptionByOrgId(orgId)

  if (!subscription) {
    return {
      success: null,
      error: { message: "No subscription found for this organization" },
    }
  }

  if (subscription.status !== "CANCELED") {
    return {
      success: null,
      error: { message: "Subscription is not canceled" },
    }
  }

  // Get the plan details from the database to retrieve the PayPal plan ID
  const planData = await getPlanById(subscription.plan)

  if (!planData) {
    return {
      success: null,
      error: { message: "Invalid plan found in subscription" },
    }
  }

  // Since PayPal doesn't allow reactivating cancelled subscriptions,
  // we need to create a new subscription instead
  const newSubscriptionData = await createPayPalSubs(
    planData.paypalPlanId,
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
 * Revises an active subscription to a different plan
 */
const reviseSubscription = async (
  orgId: string,
  planId: (typeof plan.$inferSelect)["id"]
): Promise<
  ResT<{
    approvalUrl: string
  }>
> => {
  const subscription = await getSubscriptionByOrgId(orgId)

  if (!subscription) {
    return {
      success: null,
      error: { message: "No subscription found for this organization" },
    }
  }

  if (subscription.status !== "ACTIVE") {
    return {
      success: null,
      error: { message: "Subscription is not active" },
    }
  }

  if (!subscription.externalSubscriptionId) {
    return {
      success: null,
      error: { message: "No external subscription ID found" },
    }
  }

  // Get the target plan to get its PayPal plan ID
  const targetPlan = await getPlanById(planId)
  if (!targetPlan) {
    return {
      success: null,
      error: { message: "Target plan not found" },
    }
  }

  // Revise the PayPal subscription
  const paypalResult = await revisePayPalSub(
    subscription.externalSubscriptionId,
    targetPlan.paypalPlanId
  )

  if (paypalResult.error) {
    return {
      success: null,
      error: paypalResult.error,
    }
  }

  if (paypalResult.success) {
    // Update the local subscription record
    await updateSubscription({
      id: subscription.id,
      values: {
        plan: planId,
      },
    })

    // Return the approval URL for the plan change
    const approvalLink = paypalResult.success.data.links.find(
      (link) => link.rel === "approve"
    )

    if (!approvalLink) {
      return {
        success: null,
        error: { message: "No approval link found in PayPal response" },
      }
    }

    return {
      success: {
        data: {
          approvalUrl: approvalLink.href,
        },
      },
      error: null,
    }
  }

  return {
    success: null,
    error: { message: "Unknown error occurred" },
  }
}

/**
 * Cancels an active subscription
 */
const cancelSubscription = async (orgId: string) => {
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

  if (!subscription.externalSubscriptionId)
    return {
      success: null,
      error: { message: "No external subscription ID found" },
    }

  return await cancelPayPalSub(subscription.externalSubscriptionId)
}

export { cancelSubscription, reactivateSubscription, reviseSubscription }
