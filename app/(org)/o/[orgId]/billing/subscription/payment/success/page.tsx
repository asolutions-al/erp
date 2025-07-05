import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  createSubscription,
  getSubscriptionByOrgId,
  updateSubscription,
} from "@/db/app/actions"
import { getPayPalSubscription } from "@/lib/paypal"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

type Props = {
  params: Promise<{ orgId: string }>
  searchParams: Promise<{
    subscription_id: string
    ba_token: string
    token: string
    plan?: string
  }>
}

const Page = async ({ params, searchParams }: Props) => {
  const { orgId } = await params
  const { subscription_id, plan } = await searchParams

  let subscriptionStatus = "PENDING"
  let subscriptionDetails = null
  let errorMessage = ""

  try {
    const subscription = await getPayPalSubscription(subscription_id)
    console.log("PayPal subscription data:", subscription)
    subscriptionDetails = subscription
    subscriptionStatus = subscription.status

    // If subscription is ACTIVE, update DB
    if (subscription.status === "ACTIVE") {
      // Check if org already has a subscription
      const existing = await getSubscriptionByOrgId(orgId)
      console.log("existing", existing)

      // Determine the plan to use (from URL param or default to existing plan or INVOICE-PRO)
      const planToUse = plan || existing?.plan || "INVOICE-PRO"

      if (existing) {
        // With revision API, we just update the plan - no need to cancel old subscription
        await updateSubscription({
          id: existing.id,
          values: {
            status: "ACTIVE",
            paymentProvider: "PAYPAL",
            externalSubscriptionId: subscription_id,
            plan: planToUse as
              | "INVOICE-STARTER"
              | "INVOICE-PRO"
              | "INVOICE-BUSINESS",
            startedAt: subscription.start_time,
            canceledAt: null,
          },
        })
      } else {
        await createSubscription({
          orgId,
          plan: planToUse as
            | "INVOICE-STARTER"
            | "INVOICE-PRO"
            | "INVOICE-BUSINESS",
          status: "ACTIVE",
          startedAt: subscription.start_time,
          paymentProvider: "PAYPAL",
          externalSubscriptionId: subscription_id,
        })
      }
    }
  } catch (error) {
    console.error("Error processing PayPal subscription:", error)
    subscriptionStatus = "ERROR"
    errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case "ERROR":
        return <XCircle className="h-16 w-16 text-red-500" />
      default:
        return <Clock className="h-16 w-16 text-yellow-500" />
    }
  }

  const getStatusTitle = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Payment Successful!"
      case "ERROR":
        return "Payment Failed"
      default:
        return "Payment Processing"
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Your subscription has been activated successfully. You now have access to all Invoice Pro features."
      case "ERROR":
        return "There was an issue processing your payment. Please try again or contact support."
      default:
        return "Your payment is being processed. This may take a few moments."
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="pb-6 text-center">
          <div className="mb-4 flex justify-center">
            {getStatusIcon(subscriptionStatus)}
          </div>
          <CardTitle className="text-2xl font-bold">
            {getStatusTitle(subscriptionStatus)}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="mb-4 text-gray-600">
              {getStatusMessage(subscriptionStatus)}
            </p>

            {errorMessage && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}
          </div>

          {subscriptionDetails && subscriptionStatus === "ACTIVE" && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h3 className="mb-2 font-semibold text-green-800">
                Subscription Details
              </h3>
              <div className="space-y-1 text-sm text-green-700">
                <p>
                  <strong>Plan:</strong> Invoice Pro
                </p>
                <p>
                  <strong>Status:</strong> {subscriptionDetails.status}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(
                    subscriptionDetails.start_time
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Subscription ID:</strong> {subscription_id}
                </p>
              </div>

              <div className="mt-3 border-t border-green-200 pt-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Cancel Subscription
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel your subscription
                        immediately? This action cannot be undone and you will
                        lose access to all premium features.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={async () => {
                          // TODO:
                          // try {
                          //   const response = await fetch(
                          //     "/api/paypal/cancel-subscription",
                          //     {
                          //       method: "POST",
                          //       headers: {
                          //         "Content-Type": "application/json",
                          //       },
                          //       body: JSON.stringify({
                          //         orgId,
                          //         reason:
                          //           "User cancelled immediately after subscription",
                          //       }),
                          //     }
                          //   )
                          //   if (response.ok) {
                          //     window.location.reload()
                          //   } else {
                          //     alert("Failed to cancel subscription")
                          //   }
                          // } catch (error) {
                          //   console.error("Error:", error)
                          //   alert("An error occurred")
                          // }
                        }}
                      >
                        Yes, Cancel Now
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href={`/o/${orgId}/billing/subscription`}>
                View Billing
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href={`/o/${orgId}`}>Return to Dashboard</Link>
            </Button>
          </div>

          {subscriptionStatus === "ERROR" && (
            <div className="text-center">
              <Button variant="outline" asChild>
                <Link href={`/o/${orgId}/billing/subscription`}>Try Again</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
