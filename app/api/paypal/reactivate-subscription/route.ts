import { getSubscriptionByOrgId } from "@/db/app/actions/subscription"
import { createPayPalSubscription } from "@/lib/paypal"
import { NextRequest, NextResponse } from "next/server"

const PAYPAL_PLAN_ID = process.env.PAYPAL_PLAN_ID!

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

    if (subscription.status !== "CANCELED") {
      return NextResponse.json(
        { error: "Subscription is not canceled" },
        { status: 400 }
      )
    }

    // Since PayPal doesn't allow reactivating cancelled subscriptions,
    // we need to create a new subscription instead
    const returnUrl = `${process.env.APP_URL}/o/${orgId}/billing/subscription/payment/success`
    const cancelUrl = `${process.env.APP_URL}/o/${orgId}/billing/subscription/payment/cancel`

    const newSubscriptionData = await createPayPalSubscription(
      PAYPAL_PLAN_ID,
      returnUrl,
      cancelUrl
    )

    if (newSubscriptionData.id) {
      // Get the approval URL for the user to approve the new subscription
      const approvalUrl = newSubscriptionData.links?.find(
        (l: any) => l.rel === "approve"
      )?.href

      if (approvalUrl) {
        return NextResponse.json({
          success: true,
          message: "New subscription created. Please approve to reactivate.",
          approvalUrl,
          subscriptionId: newSubscriptionData.id,
          requiresApproval: true,
        })
      } else {
        return NextResponse.json(
          { error: "Failed to get approval URL for new subscription" },
          { status: 500 }
        )
      }
    } else {
      return NextResponse.json(
        {
          error: "Failed to create new PayPal subscription",
          details: newSubscriptionData,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error reactivating subscription:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
