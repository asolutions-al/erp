// Webhook-first subscription flow helpers
import { createSubscription } from "@/db/app/actions/subscription"
import { getPlanById } from "@/db/auth/loaders"
import { createPayPalSubs } from "@/lib/paypal"

export type SubscriptionPlan =
  | "INVOICE-STARTER"
  | "INVOICE-PRO"
  | "INVOICE-BUSINESS"

export interface CreateSubscriptionParams {
  orgId: string
  plan: SubscriptionPlan
  returnUrl: string
  cancelUrl: string
}

export interface SubscriptionCreationResult {
  approvalUrl: string
  subscriptionId: string
  pendingSubscriptionCreated: boolean
}

/**
 * Webhook-first subscription creation flow
 * 1. Create PayPal subscription with custom_id set to orgId
 * 2. Create pending subscription in database
 * 3. Return approval URL for user
 * 4. Webhook will activate subscription when payment completes
 */
export async function createWebhookSubscription({
  orgId,
  plan,
}: CreateSubscriptionParams): Promise<SubscriptionCreationResult> {
  // Step 1: Get PayPal plan ID from database
  const paypalPlanId = await getPayPalPlanId(plan)

  // Step 2: Create PayPal subscription with orgId as custom_id
  const paypalSubscription = await createPayPalSubs(
    paypalPlanId,
    orgId // This links PayPal subscription to your org
  )

  // Step 2: Create pending subscription in database
  try {
    await createSubscription({
      orgId,
      plan,
      status: "PENDING",
      paymentProvider: "PAYPAL",
      externalSubscriptionId: paypalSubscription.id,
      startedAt: paypalSubscription.create_time,
    })
  } catch (error) {
    console.error("Failed to create pending subscription:", error)
    // Don't throw here - webhook will handle it if this fails
  }

  // Step 3: Find approval URL
  const approvalLink = paypalSubscription.links.find(
    (link) => link.rel === "approve"
  )
  if (!approvalLink) {
    throw new Error("No approval URL found in PayPal subscription response")
  }

  return {
    approvalUrl: approvalLink.href,
    subscriptionId: paypalSubscription.id,
    pendingSubscriptionCreated: true,
  }
}

/**
 * Get subscription status for display on success page
 * This only reads data, never modifies it (webhook does that)
 */
export async function getSubscriptionDisplayStatus(
  orgId: string,
  subscriptionId?: string
): Promise<{
  status: "PENDING" | "ACTIVE" | "CANCELED" | "ERROR"
  subscription: any | null
  message: string
}> {
  const { getSubscriptionByOrgId, getSubscriptionByExternalId } = await import(
    "@/db/app/actions/subscription"
  )

  try {
    // First try to find by orgId
    let subscription = await getSubscriptionByOrgId(orgId)

    // If not found and we have subscriptionId, try that
    if (!subscription && subscriptionId) {
      subscription = await getSubscriptionByExternalId(subscriptionId)
    }

    if (!subscription) {
      return {
        status: "PENDING",
        subscription: null,
        message:
          "Subscription is being processed. Please wait a moment and refresh the page.",
      }
    }

    const status = subscription.status as "PENDING" | "ACTIVE" | "CANCELED"
    const messages = {
      PENDING:
        "Your payment was successful and we're activating your subscription. This usually takes just a few seconds.",
      ACTIVE:
        "Your subscription has been activated successfully. You now have access to all features.",
      CANCELED: "Your subscription has been canceled.",
    }

    return {
      status,
      subscription,
      message: messages[status] || "Subscription status unknown.",
    }
  } catch (error) {
    console.error("Error getting subscription status:", error)
    return {
      status: "ERROR",
      subscription: null,
      message:
        "There was an error checking your subscription status. Please contact support.",
    }
  }
}

/**
 * Get PayPal plan ID for internal plan by querying the database
 * This replaces the manual environment variable mapping approach
 */
export async function getPayPalPlanId(plan: SubscriptionPlan): Promise<string> {
  const planRecord = await getPlanById(plan)

  if (!planRecord?.paypalPlanId) {
    throw new Error(
      `PayPal plan ID not found for plan: ${plan}. Please ensure the plan exists in your database with a valid paypalPlanId.`
    )
  }

  return planRecord.paypalPlanId
}
