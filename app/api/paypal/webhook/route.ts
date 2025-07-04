import {
  createSubscription,
  getSubscriptionByOrgId,
  updateSubscription,
} from "@/db/app/actions/subscription"
import { NextRequest, NextResponse } from "next/server"

// Optionally, verify webhook signature here for production

export async function POST(req: NextRequest) {
  const body = await req.json()
  const eventType = body.event_type
  const resource = body.resource

  if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
    // resource.id is the PayPal subscription ID
    // resource.plan_id, resource.start_time
    // You may want to map resource.custom_id to orgId if you set it
    // For now, let's assume you can look up org by externalSubscriptionId
    const existing = await getSubscriptionByOrgId(resource.custom_id || "")
    if (existing) {
      await updateSubscription({
        id: existing.id,
        values: {
          status: "ACTIVE",
          paymentProvider: "PAYPAL",
          externalSubscriptionId: resource.id,
          plan: resource.plan_id,
          startedAt: resource.start_time,
          canceledAt: null,
        },
      })
    } else if (resource.custom_id) {
      await createSubscription({
        orgId: resource.custom_id,
        plan: resource.plan_id,
        status: "ACTIVE",
        startedAt: resource.start_time,
        paymentProvider: "PAYPAL",
        externalSubscriptionId: resource.id,
      })
    }
  }

  if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
    // Mark subscription as cancelled
    const existing = await getSubscriptionByOrgId(resource.custom_id || "")
    if (existing) {
      await updateSubscription({
        id: existing.id,
        values: {
          status: "CANCELED",
          canceledAt: resource.update_time,
        },
      })
    }
  }

  return NextResponse.json({ received: true })
}
