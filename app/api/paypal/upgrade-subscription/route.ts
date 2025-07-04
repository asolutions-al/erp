import { getSubscriptionByOrgId } from "@/db/app/actions"
import { getPlanById } from "@/db/auth/loaders"
import { revisePayPalSubscription } from "@/lib/paypal"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { orgId, planId } = await req.json()

    if (!orgId || !planId) {
      return NextResponse.json(
        { error: "Missing orgId or planId" },
        { status: 400 }
      )
    }

    // Get the new plan from database
    const newPlan = await getPlanById(planId)
    if (!newPlan) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 })
    }

    // Get current subscription
    const currentSubscription = await getSubscriptionByOrgId(orgId)

    if (!currentSubscription || !currentSubscription.externalSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      )
    }

    if (currentSubscription.plan === planId) {
      return NextResponse.json(
        { error: "Already on the selected plan" },
        { status: 400 }
      )
    }

    // Use PayPal revision API to change the subscription plan
    const data = await revisePayPalSubscription(
      currentSubscription.externalSubscriptionId,
      newPlan.paypalPlanId,
      `Plan change from ${currentSubscription.plan} to ${planId}`
    )

    const approvalUrl = data.links?.find((l: any) => l.rel === "approve")?.href

    if (!approvalUrl) {
      return NextResponse.json(
        { error: "Failed to get PayPal approval URL" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      approvalUrl,
      subscriptionId: currentSubscription.externalSubscriptionId,
      planId,
      message: "Subscription revision initiated. Please approve the changes.",
    })
  } catch (error) {
    console.error("Error changing subscription plan:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to initiate plan change",
      },
      { status: 500 }
    )
  }
}
