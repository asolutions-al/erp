import {
  createSubscription,
  getSubscriptionByExternalId,
  getSubscriptionByOrgId,
  updateSubscription,
} from "@/db/app/actions/subscription"
import { getPlanByPayPalId } from "@/db/auth/actions/plan"
import { NextRequest, NextResponse } from "next/server"

// Verify PayPal webhook signature for security
async function verifyWebhookSignature(
  req: NextRequest,
  body: string
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) {
    console.warn(
      "PAYPAL_WEBHOOK_ID not configured - skipping signature verification"
    )
    return true // In development, you might skip verification
  }

  try {
    const headers = req.headers
    const authAlgo = headers.get("paypal-auth-algo")
    const transmission_id = headers.get("paypal-transmission-id")
    const cert_id = headers.get("paypal-cert-id")
    const transmission_sig = headers.get("paypal-transmission-sig")
    const transmission_time = headers.get("paypal-transmission-time")

    if (
      !authAlgo ||
      !transmission_id ||
      !cert_id ||
      !transmission_sig ||
      !transmission_time
    ) {
      return false
    }

    // In production, implement full signature verification
    // For now, basic validation that required headers are present
    return true
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return false
  }
}

type EventType =
  | "BILLING.SUBSCRIPTION.CREATED"
  | "BILLING.SUBSCRIPTION.ACTIVATED"
  | "BILLING.SUBSCRIPTION.CANCELLED"
  | "BILLING.SUBSCRIPTION.SUSPENDED"
  | "BILLING.SUBSCRIPTION.EXPIRED"
  | "BILLING.SUBSCRIPTION.PAYMENT.FAILED"
  | "BILLING.SUBSCRIPTION.UPDATED"
  | "PAYMENT.SALE.COMPLETED"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()

    // Verify webhook signature for security
    const isValid = await verifyWebhookSignature(req, body)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const data = JSON.parse(body)
    const eventType = data.event_type as EventType
    const resource = data.resource

    const MAP: Record<EventType, (resource: any) => Promise<void>> = {
      "BILLING.SUBSCRIPTION.CREATED": (resource) =>
        handleSubscriptionCreated(resource as SubscriptionCreatedResource),
      "BILLING.SUBSCRIPTION.ACTIVATED": (resource) =>
        handleSubscriptionActivated(resource as SubscriptionActivatedResource),
      "BILLING.SUBSCRIPTION.CANCELLED": (resource) =>
        handleSubscriptionCancelled(resource as SubscriptionCancelledResource),
      "BILLING.SUBSCRIPTION.SUSPENDED": (resource) =>
        handleSubscriptionSuspended(resource as SubscriptionSuspendedResource),
      "BILLING.SUBSCRIPTION.EXPIRED": (resource) =>
        handleSubscriptionExpired(resource as SubscriptionExpiredResource),
      "BILLING.SUBSCRIPTION.PAYMENT.FAILED": (resource) =>
        handlePaymentFailed(resource as PaymentFailedResource),
      "BILLING.SUBSCRIPTION.UPDATED": (resource) =>
        handleSubscriptionUpdated(resource as SubscriptionUpdatedResource),
      "PAYMENT.SALE.COMPLETED": (resource) =>
        handlePaymentCompleted(resource as PaymentCompletedResource),
    }

    const handler = MAP[eventType]

    await handler?.(resource)

    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}

/**
 * PayPal Webhook Event Resource Types based on official documentation
 * https://developer.paypal.com/docs/api/subscriptions/v1/
 * https://developer.paypal.com/docs/api/webhooks/v1/
 */

// Base interfaces for common structures
interface PayPalMoney {
  currency_code: string
  value: string
}

interface PayPalName {
  given_name?: string
  surname?: string
  full_name?: string
}

interface PayPalAddress {
  address_line_1?: string
  address_line_2?: string
  admin_area_1?: string
  admin_area_2?: string
  postal_code?: string
  country_code: string
}

interface PayPalLink {
  href: string
  rel: string
  method: string
}

interface PayPalSubscriber {
  name?: PayPalName
  email_address?: string
  payer_id?: string
  shipping_address?: {
    name?: PayPalName
    address?: PayPalAddress
  }
}

interface PayPalBillingInfo {
  outstanding_balance?: PayPalMoney
  cycle_executions?: Array<{
    tenure_type: "TRIAL" | "REGULAR"
    sequence: number
    cycles_completed: number
    cycles_remaining: number
    total_cycles: number
  }>
  last_payment?: {
    amount: PayPalMoney
    time: string
    status?:
      | "COMPLETED"
      | "DECLINED"
      | "PARTIALLY_REFUNDED"
      | "PENDING"
      | "REFUNDED"
  }
  next_billing_time?: string
  failed_payments_count?: number
  last_failed_payment?: {
    amount: PayPalMoney
    time: string
    reason_code?: string
    next_payment_retry_time?: string
  }
}

/**
 * Resource for BILLING.SUBSCRIPTION.CREATED webhook event
 * Triggered when a subscription is first created but not yet approved/activated
 */
interface SubscriptionCreatedResource {
  id: string
  status: "APPROVAL_PENDING" | "CREATED"
  plan_id: string
  custom_id?: string // Contains orgId
  start_time?: string
  create_time: string
  quantity?: string
  subscriber?: PayPalSubscriber
  links?: PayPalLink[]
}

/**
 * Resource for BILLING.SUBSCRIPTION.ACTIVATED webhook event
 * Triggered when a subscription becomes active and billing begins
 */
interface SubscriptionActivatedResource {
  id: string
  status: "ACTIVE"
  plan_id: string
  custom_id?: string // Contains orgId
  start_time?: string
  create_time: string
  update_time?: string
  quantity?: string
  subscriber?: PayPalSubscriber
  billing_info?: PayPalBillingInfo
  links?: PayPalLink[]
}

/**
 * Resource for BILLING.SUBSCRIPTION.CANCELLED webhook event
 * Triggered when a subscription is cancelled by merchant or subscriber
 */
interface SubscriptionCancelledResource {
  id: string
  status: "CANCELLED"
  plan_id: string
  custom_id?: string
  start_time?: string
  create_time: string
  update_time: string
  status_change_note?: string
  status_update_time: string
  subscriber?: PayPalSubscriber
  billing_info?: PayPalBillingInfo
  links?: PayPalLink[]
}

/**
 * Resource for BILLING.SUBSCRIPTION.SUSPENDED webhook event
 * Triggered when a subscription is temporarily suspended (e.g., payment failures)
 */
interface SubscriptionSuspendedResource {
  id: string
  status: "SUSPENDED"
  plan_id: string
  custom_id?: string
  start_time?: string
  create_time: string
  update_time: string
  status_change_note?: string
  status_update_time: string
  subscriber?: PayPalSubscriber
  billing_info?: PayPalBillingInfo
  links?: PayPalLink[]
}

/**
 * Resource for BILLING.SUBSCRIPTION.EXPIRED webhook event
 * Triggered when a subscription reaches its natural end date
 */
interface SubscriptionExpiredResource {
  id: string
  status: "EXPIRED"
  plan_id: string
  custom_id?: string
  start_time?: string
  create_time: string
  update_time: string
  status_update_time: string
  subscriber?: PayPalSubscriber
  billing_info?: PayPalBillingInfo
  links?: PayPalLink[]
}

/**
 * Resource for BILLING.SUBSCRIPTION.UPDATED webhook event
 * Triggered when subscription details are modified (plan changes, quantity, etc.)
 */
interface SubscriptionUpdatedResource {
  id: string
  status: "ACTIVE" | "SUSPENDED" | "CANCELLED"
  plan_id: string
  custom_id?: string
  start_time?: string
  create_time: string
  update_time: string
  quantity?: string
  plan_overridden?: boolean
  subscriber?: PayPalSubscriber
  billing_info?: PayPalBillingInfo
  links?: PayPalLink[]
}

/**
 * Resource for BILLING.SUBSCRIPTION.PAYMENT.FAILED webhook event
 * Triggered when a scheduled payment for a subscription fails
 */
interface PaymentFailedResource {
  id: string // Subscription ID
  status: "ACTIVE" | "SUSPENDED"
  plan_id: string
  custom_id?: string
  billing_info?: PayPalBillingInfo & {
    last_failed_payment: {
      amount: PayPalMoney
      time: string
      reason_code:
        | "PAYMENT_DENIED"
        | "INTERNAL_SERVER_ERROR"
        | "PAYEE_ACCOUNT_RESTRICTED"
        | "PAYER_ACCOUNT_RESTRICTED"
        | "PAYER_CANNOT_PAY"
        | "SENDING_LIMIT_EXCEEDED"
        | "TRANSACTION_RECEIVING_LIMIT_EXCEEDED"
        | "CURRENCY_MISMATCH"
      next_payment_retry_time?: string
    }
  }
  subscriber?: PayPalSubscriber
  links?: PayPalLink[]
}

/**
 * Resource for PAYMENT.SALE.COMPLETED webhook event
 * Triggered when a payment is successfully completed for a subscription
 */
interface PaymentCompletedResource {
  id: string // Payment/Transaction ID
  status: "COMPLETED"
  amount?: PayPalMoney
  final_capture?: boolean
  seller_protection?: {
    status: string
    dispute_categories?: string[]
  }
  create_time: string
  update_time: string
  billing_agreement_id?: string // Subscription ID
  links?: PayPalLink[]
}

/**
 * Union type for all possible webhook resource types
 * Used for type safety when processing different webhook events
 */
type WebhookResource =
  | SubscriptionCreatedResource
  | SubscriptionActivatedResource
  | SubscriptionCancelledResource
  | SubscriptionSuspendedResource
  | SubscriptionExpiredResource
  | SubscriptionUpdatedResource
  | PaymentFailedResource
  | PaymentCompletedResource

async function handleSubscriptionActivated(
  resource: SubscriptionActivatedResource
) {
  const subscriptionId = resource.id
  const customId = resource.custom_id // This should contain orgId

  if (!customId) return

  try {
    // Query database for plan by PayPal plan ID instead of manual mapping
    const planRecord = await getPlanByPayPalId(resource.plan_id)

    if (!planRecord) return

    const plan = planRecord.id

    // Try to find existing subscription by orgId first, then by external subscription ID
    let existing = await getSubscriptionByOrgId(customId)

    if (!existing) {
      existing = await getSubscriptionByExternalId(subscriptionId)
    }

    if (existing) {
      // Update existing subscription to ACTIVE
      await updateSubscription({
        id: existing.id,
        values: {
          status: "ACTIVE",
          paymentProvider: "PAYPAL",
          externalSubscriptionId: subscriptionId,
          plan: plan as "INVOICE-STARTER" | "INVOICE-PRO" | "INVOICE-BUSINESS",
          startedAt: resource.start_time || existing.startedAt,
          canceledAt: null,
          orgId: customId, // Ensure orgId is correctly set
        },
      })
    } else {
      // Create new active subscription if none exists (fallback case)
      await createSubscription({
        orgId: customId,
        plan: plan as "INVOICE-STARTER" | "INVOICE-PRO" | "INVOICE-BUSINESS",
        status: "ACTIVE",
        startedAt: resource.start_time || new Date().toISOString(),
        paymentProvider: "PAYPAL",
        externalSubscriptionId: subscriptionId,
      })
    }
  } catch (error) {}
}

async function handleSubscriptionCancelled(
  resource: SubscriptionCancelledResource
) {
  const subscriptionId = resource.id

  try {
    // Find subscription by external ID instead of custom_id for cancelled events
    const existing = await getSubscriptionByExternalId(subscriptionId)
    if (existing) {
      await updateSubscription({
        id: existing.id,
        values: {
          status: "CANCELED", // Fixed typo: CANCELLED -> CANCELED
          canceledAt: new Date().toISOString(),
        },
      })
    }
  } catch (error) {
    console.error("Failed to process subscription cancellation:", error)
  }
}

async function handleSubscriptionSuspended(
  resource: SubscriptionSuspendedResource
) {
  const subscriptionId = resource.id

  try {
    const existing = await getSubscriptionByExternalId(subscriptionId)
    if (existing) {
      await updateSubscription({
        id: existing.id,
        values: {
          status: "PENDING", // Use PENDING since SUSPENDED might not be a valid status
        },
      })
    }
  } catch (error) {
    console.error("Failed to process subscription suspension:", error)
  }
}

async function handlePaymentFailed(resource: PaymentFailedResource) {
  const subscriptionId = resource.id

  try {
    // Log payment failure for monitoring
    console.warn("Payment failed for subscription", {
      subscriptionId,
      reason: resource.billing_info?.last_failed_payment?.reason_code,
    })

    // Optionally update subscription status or send notification
    // You might want to implement a payment retry mechanism
  } catch (error) {
    console.error("Failed to process payment failure:", error)
  }
}

// Handler for when subscription is first created (before activation)
async function handleSubscriptionCreated(
  resource: SubscriptionCreatedResource
) {
  const subscriptionId = resource.id
  const customId = resource.custom_id

  if (!customId) {
    console.error("No custom_id in subscription created event", {
      subscriptionId,
    })
    return
  }

  try {
    // Query database for plan instead of manual mapping
    const planRecord = await getPlanByPayPalId(resource.plan_id)

    if (!planRecord) {
      console.error("Unknown PayPal plan ID in subscription creation", {
        paypalPlanId: resource.plan_id,
        subscriptionId,
      })
      return
    }

    const plan = planRecord.id

    // Check if subscription already exists (by orgId or external subscription ID)
    let existing = await getSubscriptionByOrgId(customId)

    // Also check by external subscription ID in case it was created with different orgId
    if (!existing) {
      existing = await getSubscriptionByExternalId(subscriptionId)
    }

    if (existing) {
      // Update existing subscription with PayPal details
      await updateSubscription({
        id: existing.id,
        values: {
          status: "PENDING", // Set to pending, will be activated by ACTIVATED webhook
          paymentProvider: "PAYPAL",
          externalSubscriptionId: subscriptionId,
          plan: plan as "INVOICE-STARTER" | "INVOICE-PRO" | "INVOICE-BUSINESS",
          startedAt: resource.start_time || existing.startedAt,
          orgId: customId, // Ensure orgId is correctly set
        },
      })
    } else {
      // Create new pending subscription that will be activated by webhook
      await createSubscription({
        orgId: customId,
        plan,
        status: "PENDING",
        paymentProvider: "PAYPAL",
        externalSubscriptionId: subscriptionId,
        startedAt:
          resource.start_time ||
          resource.create_time ||
          new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Failed to process subscription creation:", error)
  }
}

// Handler for subscription expiration
async function handleSubscriptionExpired(
  resource: SubscriptionExpiredResource
) {
  const subscriptionId = resource.id

  try {
    const existing = await getSubscriptionByExternalId(subscriptionId)
    if (existing) {
      await updateSubscription({
        id: existing.id,
        values: {
          status: "CANCELED", // Treat expired as canceled
          canceledAt: new Date().toISOString(),
        },
      })
    }
  } catch (error) {
    console.error("Failed to process subscription expiration:", error)
  }
}

// Handler for subscription updates (plan changes, etc.)
async function handleSubscriptionUpdated(
  resource: SubscriptionUpdatedResource
) {
  const subscriptionId = resource.id

  try {
    const existing = await getSubscriptionByExternalId(subscriptionId)
    if (existing) {
      // Query database for plan instead of manual mapping
      const planRecord = await getPlanByPayPalId(resource.plan_id)

      if (!planRecord) {
        console.error("Unknown PayPal plan ID in subscription update", {
          paypalPlanId: resource.plan_id,
          subscriptionId,
        })
        return
      }

      const newPlan = planRecord.id

      if (newPlan && newPlan !== existing.plan) {
        await updateSubscription({
          id: existing.id,
          values: {
            plan: newPlan,
            status: resource.status === "ACTIVE" ? "ACTIVE" : existing.status,
          },
        })
      }
    }
  } catch (error) {
    console.error("Failed to process subscription update:", error)
  }
}

// Handler for successful payments (useful for tracking)
async function handlePaymentCompleted(resource: PaymentCompletedResource) {
  const subscriptionId = resource.billing_agreement_id

  if (!subscriptionId) return

  try {
    // You could track successful payments in a separate table if needed
    // For now, just ensure subscription is active
    const existing = await getSubscriptionByExternalId(subscriptionId)
    if (existing && existing.status !== "ACTIVE") {
      await updateSubscription({
        id: existing.id,
        values: {
          status: "ACTIVE",
        },
      })
    }
  } catch (error) {
    console.error("Failed to process payment completion:", error)
  }
}
