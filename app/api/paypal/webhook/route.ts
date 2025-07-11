import {
  getSubscriptionByExternalId,
  getSubscriptionByOrgId,
  updateSubscription,
} from "@/db/app/actions/subscription"
import { getPlanByPayPalId } from "@/db/auth/actions/plan"
import { NextRequest, NextResponse } from "next/server"

type EventType =
  | "BILLING.SUBSCRIPTION.CREATED"
  | "BILLING.SUBSCRIPTION.ACTIVATED"
  | "BILLING.SUBSCRIPTION.CANCELLED"
  | "BILLING.SUBSCRIPTION.SUSPENDED"
  | "BILLING.SUBSCRIPTION.EXPIRED"

type Resource = {
  id: string
  plan_id: string
  custom_id?: string // Contains orgId
}

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
    const body = await req.text()

    // Verify webhook signature for security
    const isValid = await verifyWebhookSignature(req, body)
    if (!isValid)
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })

    const data = JSON.parse(body)
    const eventType = data.event_type as EventType
    const resource = data.resource as Resource

    const MAP: Record<EventType, (resource: any) => Promise<void>> = {
      "BILLING.SUBSCRIPTION.CREATED": handleSubscriptionCreated,
      "BILLING.SUBSCRIPTION.ACTIVATED": handleSubscriptionActivated,
      "BILLING.SUBSCRIPTION.CANCELLED": handleSubscriptionCancelled,
      "BILLING.SUBSCRIPTION.SUSPENDED": handleSubscriptionSuspended,
      "BILLING.SUBSCRIPTION.EXPIRED": handleSubscriptionExpired,
    }

    const handler = MAP[eventType]

    await handler?.(resource)

    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}

const handleSubscriptionCreated = async (resource: Resource) => {
  const subscriptionId = resource.id
  const orgId = resource.custom_id

  if (!orgId) return

  try {
    const existing = await getSubscriptionByOrgId(orgId)

    if (!existing) return

    const planRecord = await getPlanByPayPalId(resource.plan_id)

    if (!planRecord) return

    await updateSubscription({
      id: existing.id,
      values: {
        status: "CREATED",
        paymentProvider: "PAYPAL",
        externalSubscriptionId: subscriptionId,
        plan: planRecord.id,
      },
    })
  } catch (error) {
    console.error("Failed to process subscription creation:", error)
  }
}

const handleSubscriptionActivated = async (resource: Resource) => {
  const subscriptionId = resource.id
  const orgId = resource.custom_id

  if (!orgId) return

  try {
    const existing = await getSubscriptionByOrgId(orgId)

    if (!existing) return

    const planRecord = await getPlanByPayPalId(resource.plan_id)

    if (!planRecord) return

    await updateSubscription({
      id: existing.id,
      values: {
        status: "ACTIVE",
        paymentProvider: "PAYPAL",
        plan: planRecord.id,
        externalSubscriptionId: subscriptionId,
      },
    })
  } catch (error) {
    console.error("Failed to process subscription activation:", error)
  }
}

const handleSubscriptionCancelled = async (resource: Resource) => {
  const subscriptionId = resource.id

  try {
    const existing = await getSubscriptionByExternalId(subscriptionId)
    if (existing) {
      await updateSubscription({
        id: existing.id,
        values: {
          status: "CANCELED",
        },
      })
    }
  } catch (error) {
    console.error("Failed to process subscription cancellation:", error)
  }
}

const handleSubscriptionSuspended = async (resource: Resource) => {
  const subscriptionId = resource.id

  try {
    const existing = await getSubscriptionByExternalId(subscriptionId)
    if (existing) {
      await updateSubscription({
        id: existing.id,
        values: {
          status: "SUSPENDED",
        },
      })
    }
  } catch (error) {
    console.error("Failed to process subscription suspension:", error)
  }
}

const handleSubscriptionExpired = async (resource: Resource) => {
  const subscriptionId = resource.id

  try {
    const existing = await getSubscriptionByExternalId(subscriptionId)
    if (existing) {
      await updateSubscription({
        id: existing.id,
        values: {
          status: "EXPIRED",
        },
      })
    }
  } catch (error) {
    console.error("Failed to process subscription expiration:", error)
  }
}
