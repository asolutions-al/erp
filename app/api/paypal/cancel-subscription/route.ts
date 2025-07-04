import {
  getSubscriptionByOrgId,
  updateSubscription,
} from "@/db/app/actions/subscription"
import { cancelPayPalSubscription } from "@/lib/paypal"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { orgId, reason } = await req.json()

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      )
    }

    // Get the subscription from database
    const subscription = await getSubscriptionByOrgId(orgId)

    if (!subscription) {
      return NextResponse.json(
        { error: "No subscription found for this organization" },
        { status: 404 }
      )
    }

    if (subscription.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Subscription is not active" },
        { status: 400 }
      )
    }

    if (!subscription.externalSubscriptionId) {
      return NextResponse.json(
        { error: "No external subscription ID found" },
        { status: 400 }
      )
    }

    // Cancel subscription with PayPal
    const cancelResult = await cancelPayPalSubscription(
      subscription.externalSubscriptionId,
      reason || "User requested cancellation"
    )

    if (cancelResult.success) {
      // Update subscription in database
      await updateSubscription({
        id: subscription.id,
        values: {
          status: "CANCELED",
          canceledAt: new Date().toISOString(),
        },
      })

      return NextResponse.json({
        success: true,
        message: "Subscription cancelled successfully",
      })
    } else {
      return NextResponse.json(
        {
          error: "Failed to cancel subscription with PayPal",
          details: cancelResult,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error canceling subscription:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
