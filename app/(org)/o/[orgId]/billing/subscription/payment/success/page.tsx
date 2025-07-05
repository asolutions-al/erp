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
import { getPayPalSub } from "@/lib/paypal"
import { getSubscriptionDisplayStatus } from "@/lib/webhook-subscription"
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
  const { subscription_id } = await searchParams

  // Get current subscription status (read-only, webhook updates the data)
  const {
    status: subscriptionStatus,
    subscription: subscriptionDetails,
    message,
  } = await getSubscriptionDisplayStatus(orgId, subscription_id)

  let errorMessage = ""

  // Only fetch PayPal details if we have a subscription ID (for display purposes)
  let paypalSubscription = null
  if (subscription_id) {
    try {
      const res = await getPayPalSub(subscription_id)
      if (res.error) {
        errorMessage =
          res.error.message || "Failed to fetch PayPal subscription"
      } else {
        paypalSubscription = res.success?.data
      }
    } catch (error) {
      console.error("Error fetching PayPal subscription details:", error)
      errorMessage = "Could not fetch subscription details from PayPal"
    }
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
      case "PENDING":
        return "Payment Confirmed - Activating..."
      case "ERROR":
        return "Payment Failed"
      default:
        return "Payment Processing"
    }
  }

  const getStatusMessage = (status: string) => {
    // Use the message from webhook helper for consistency
    return (
      message || "Your payment is being processed. This may take a few moments."
    )
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
                  <strong>Plan:</strong>{" "}
                  {subscriptionDetails.plan || "Invoice Pro"}
                </p>
                <p>
                  <strong>Status:</strong> {subscriptionDetails.status}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {subscriptionDetails.startedAt
                    ? new Date(
                        subscriptionDetails.startedAt
                      ).toLocaleDateString()
                    : "N/A"}
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
