import { createPayPalSubscription } from "@/lib/paypal"
import { NextRequest, NextResponse } from "next/server"

const PAYPAL_PLAN_ID = process.env.PAYPAL_PLAN_ID!

export async function POST(req: NextRequest) {
  const { orgId } = await req.json()
  // You can add more logic to select plan if needed
  const returnUrl = `${process.env.APP_URL}/o/${orgId}/billing/subscription/payment/success`
  const cancelUrl = `${process.env.APP_URL}/o/${orgId}/billing/subscription/payment/cancel`

  const data = await createPayPalSubscription(
    PAYPAL_PLAN_ID,
    returnUrl,
    cancelUrl
  )
  const approvalUrl = data.links?.find((l: any) => l.rel === "approve")?.href
  return NextResponse.json({ approvalUrl, subscriptionId: data.id })
}
