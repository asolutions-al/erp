import {
  getSubscriptionByOrgId,
  updateSubscription,
} from "@/db/app/actions/subscription"
import { getPlanById, getPlans } from "@/db/auth/loaders"
import {
  cancelPayPalSubscription,
  createPayPalSubscription,
} from "@/lib/paypal"
import { BillingPage } from "./billing-page"

type Props = {
  params: Promise<GlobalParams>
}

const reactivateSubscription = async (
  orgId: string
): Promise<
  ResT<{
    approvalUrl: string
  }>
> => {
  const subscription = await getSubscriptionByOrgId(orgId)
  console.log("reactivateSubscription", subscription)

  if (!subscription) {
    return {
      // data: null,
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
  const plan = await getPlanById(subscription.plan)

  if (!plan) {
    return {
      success: null,
      error: { message: "Invalid plan found in subscription" },
    }
  }

  // Since PayPal doesn't allow reactivating cancelled subscriptions,
  // we need to create a new subscription instead
  const returnUrl = `${process.env.APP_URL}/o/${orgId}/billing/subscription/payment/success`
  const cancelUrl = `${process.env.APP_URL}/o/${orgId}/billing/subscription/payment/cancel`

  const newSubscriptionData = await createPayPalSubscription(
    plan.paypalPlanId,
    returnUrl,
    cancelUrl
  )

  console.log("newSubscriptionData", newSubscriptionData)

  if (!newSubscriptionData.id) {
    return {
      success: null,
      error: { message: "Failed to create new subscription" },
    }
  }

  // Get the approval URL for the user to approve the new subscription
  const approvalUrl = newSubscriptionData.links?.find(
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

const cancelSubscription = async (orgId: string): Promise<ResT<true>> => {
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

  // Cancel the subscription with PayPal
  const cancelResult = await cancelPayPalSubscription(
    subscription.externalSubscriptionId
  )

  if (cancelResult.success) {
    // Update the subscription in the database
    await updateSubscription({
      id: subscription.id,
      values: {
        status: "CANCELED",
        canceledAt: new Date().toISOString(),
      },
    })

    return {
      success: { data: true },
      error: null,
    }
  } else {
    return {
      success: null,
      error: { message: "Failed to cancel subscription with PayPal" },
    }
  }
}

const Page = async (props: Props) => {
  const { orgId } = await props.params

  const subscription = await getSubscriptionByOrgId(orgId)
  const plans = await getPlans()

  if (!subscription) return null

  return (
    <BillingPage
      subscription={subscription}
      plans={plans}
      changePlan={async (planId) => {
        "use server"
        return {
          success: null,
          error: {
            message: "Plan change is not implemented yet.",
          },
        }
      }}
      cancelSubscription={async () => {
        "use server"
        const res = await cancelSubscription(orgId)
        return res
      }}
      reactivateSubscription={async () => {
        "use server"
        const res = await reactivateSubscription(orgId)
        return res
      }}
    />
  )
}

export default Page
