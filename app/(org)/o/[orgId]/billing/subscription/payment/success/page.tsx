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
import { getSubscriptionByExternalId } from "@/db/app/actions"
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

  const subscriptionDetails = await getSubscriptionByExternalId(subscription_id)

  if (!subscriptionDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="pb-6 text-center">
            <div className="mb-4 flex justify-center">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Subscription Not Found
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="mb-4 text-gray-600">
                We couldn't find a subscription with the provided ID. This might
                be due to:
              </p>
              <ul className="mb-4 text-left text-sm text-gray-600">
                <li>• The subscription has already been canceled</li>
                <li>• The subscription ID is invalid</li>
                <li>• There was an error processing your payment</li>
              </ul>
            </div>

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
          </CardContent>
        </Card>
      </div>
    )
  }

  const subscriptionStatus = subscriptionDetails.status

  const getStatusIcon = () => {
    switch (subscriptionStatus) {
      case "ACTIVE":
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case "ERROR":
        return <XCircle className="h-16 w-16 text-red-500" />
      case "CANCELED":
        return <XCircle className="h-16 w-16 text-gray-500" />
      default:
        return <Clock className="h-16 w-16 text-yellow-500" />
    }
  }

  const getStatusTitle = () => {
    switch (subscriptionStatus) {
      case "ACTIVE":
        return "Payment Successful!"
      case "PENDING":
        return "Payment Confirmed - Activating..."
      case "ERROR":
        return "Payment Failed"
      case "CANCELED":
        return "Subscription Canceled"
      default:
        return "Payment Processing"
    }
  }

  const getStatusMessage = () => {
    switch (subscriptionStatus) {
      case "ACTIVE":
        return "Your subscription has been activated successfully. You now have access to all features."
      case "PENDING":
        return "Your payment was successful and we're activating your subscription. This usually takes just a few seconds."
      case "ERROR":
        return "There was an error processing your payment. Please try again."
      case "CANCELED":
        return "Your subscription has been canceled. You no longer have access to premium features."
      default:
        return "Your payment is being processed. This may take a few moments."
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="pb-6 text-center">
          <div className="mb-4 flex justify-center">{getStatusIcon()}</div>
          <CardTitle className="text-2xl font-bold">
            {getStatusTitle()}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="mb-4 text-gray-600">{getStatusMessage()}</p>
          </div>

          {subscriptionStatus === "ACTIVE" && (
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
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                        Yes, Cancel Now
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          {subscriptionStatus === "CANCELED" && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold text-gray-800">
                Subscription Details
              </h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <strong>Plan:</strong>{" "}
                  {subscriptionDetails.plan || "Invoice Pro"}
                </p>
                <p>
                  <strong>Status:</strong> {subscriptionDetails.status}
                </p>
                <p>
                  <strong>Canceled Date:</strong>{" "}
                  {subscriptionDetails.canceledAt
                    ? new Date(
                        subscriptionDetails.canceledAt
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Subscription ID:</strong> {subscription_id}
                </p>
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

          {/* {subscriptionStatus === "ERROR" && (
            <div className="text-center">
              <Button variant="outline" asChild>
                <Link href={`/o/${orgId}/billing/subscription`}>Try Again</Link>
              </Button>
            </div>
          )} */}
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
