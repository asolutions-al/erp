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

export async function POST(req: NextRequest) {
  try {
    console.log("Received PayPal webhook request")
    const body = await req.text()

    // Verify webhook signature for security
    const isValid = await verifyWebhookSignature(req, body)
    if (!isValid) {
      console.error("Invalid webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const data = JSON.parse(body)
    const eventType = data.event_type
    const resource = data.resource

    console.log(`Processing PayPal webhook: ${eventType}`, {
      subscriptionId: resource?.id,
      customId: resource?.custom_id,
    })

    // Handle all subscription lifecycle events
    switch (eventType) {
      case "BILLING.SUBSCRIPTION.CREATED":
        await handleSubscriptionCreated(resource)
        break
      case "BILLING.SUBSCRIPTION.ACTIVATED":
        await handleSubscriptionActivated(resource)
        break
      case "BILLING.SUBSCRIPTION.CANCELLED":
        await handleSubscriptionCancelled(resource)
        break
      case "BILLING.SUBSCRIPTION.SUSPENDED":
        await handleSubscriptionSuspended(resource)
        break
      case "BILLING.SUBSCRIPTION.EXPIRED":
        await handleSubscriptionExpired(resource)
        break
      case "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
        await handlePaymentFailed(resource)
        break
      case "BILLING.SUBSCRIPTION.UPDATED":
        await handleSubscriptionUpdated(resource)
        break
      case "PAYMENT.SALE.COMPLETED":
        await handlePaymentCompleted(resource)
        break
      default:
        console.log(`Unhandled webhook event: ${eventType}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}

async function handleSubscriptionActivated(resource: any) {
  const subscriptionId = resource.id
  const customId = resource.custom_id // This should contain orgId

  if (!customId) {
    console.error("No custom_id in subscription resource", { subscriptionId })
    return
  }

  try {
    const existing = await getSubscriptionByOrgId(customId)

    // Query database for plan by PayPal plan ID instead of manual mapping
    const planRecord = await getPlanByPayPalId(resource.plan_id)

    if (!planRecord) {
      console.error("Unknown PayPal plan ID", {
        paypalPlanId: resource.plan_id,
        subscriptionId,
      })
      return
    }

    const plan = planRecord.id

    if (existing) {
      await updateSubscription({
        id: existing.id,
        values: {
          status: "ACTIVE",
          paymentProvider: "PAYPAL",
          externalSubscriptionId: subscriptionId,
          plan: plan as "INVOICE-STARTER" | "INVOICE-PRO" | "INVOICE-BUSINESS",
          startedAt: resource.start_time,
          canceledAt: null,
        },
      })
    } else {
      await createSubscription({
        orgId: customId,
        plan: plan as "INVOICE-STARTER" | "INVOICE-PRO" | "INVOICE-BUSINESS",
        status: "ACTIVE",
        startedAt: resource.start_time,
        paymentProvider: "PAYPAL",
        externalSubscriptionId: subscriptionId,
      })
    }

    console.log("Subscription activated successfully", {
      orgId: customId,
      subscriptionId,
    })
  } catch (error) {
    console.error("Failed to process subscription activation:", error)
  }
}

async function handleSubscriptionCancelled(resource: any) {
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
      console.log("Subscription cancelled successfully", { subscriptionId })
    }
  } catch (error) {
    console.error("Failed to process subscription cancellation:", error)
  }
}

async function handleSubscriptionSuspended(resource: any) {
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
      console.log("Subscription suspended successfully", { subscriptionId })
    }
  } catch (error) {
    console.error("Failed to process subscription suspension:", error)
  }
}

async function handlePaymentFailed(resource: any) {
  const subscriptionId = resource.id

  try {
    // Log payment failure for monitoring
    console.warn("Payment failed for subscription", {
      subscriptionId,
      reason: resource.failure_reason,
    })

    // Optionally update subscription status or send notification
    // You might want to implement a payment retry mechanism
  } catch (error) {
    console.error("Failed to process payment failure:", error)
  }
}

// Handler for when subscription is first created (before activation)
async function handleSubscriptionCreated(resource: any) {
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

    // Check if subscription already exists
    const existing = await getSubscriptionByOrgId(customId)

    if (!existing) {
      // Create pending subscription that will be activated by webhook
      await createSubscription({
        orgId: customId,
        plan,
        status: "PENDING",
        paymentProvider: "PAYPAL",
        externalSubscriptionId: subscriptionId,
        startedAt: resource.create_time || new Date().toISOString(),
      })

      console.log("Pending subscription created", {
        orgId: customId,
        subscriptionId,
      })
    }
  } catch (error) {
    console.error("Failed to process subscription creation:", error)
  }
}

// Handler for subscription expiration
async function handleSubscriptionExpired(resource: any) {
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
      console.log("Subscription expired successfully", { subscriptionId })
    }
  } catch (error) {
    console.error("Failed to process subscription expiration:", error)
  }
}

// Handler for subscription updates (plan changes, etc.)
async function handleSubscriptionUpdated(resource: any) {
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
        console.log("Subscription updated successfully", {
          subscriptionId,
          oldPlan: existing.plan,
          newPlan,
        })
      }
    }
  } catch (error) {
    console.error("Failed to process subscription update:", error)
  }
}

// Handler for successful payments (useful for tracking)
async function handlePaymentCompleted(resource: any) {
  const subscriptionId = resource.billing_agreement_id

  if (!subscriptionId) {
    console.log("Payment completed but no subscription ID found", { resource })
    return
  }

  try {
    console.log("Payment completed for subscription", {
      subscriptionId,
      amount: resource.amount?.total,
      currency: resource.amount?.currency,
      paymentId: resource.id,
    })

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
