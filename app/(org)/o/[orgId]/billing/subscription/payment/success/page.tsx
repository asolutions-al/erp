import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSubscriptionByExternalId } from "@/db/app/actions"
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  XCircle,
} from "lucide-react"
import Link from "next/link"

type Props = {
  params: Promise<{ orgId: string }>
  searchParams: Promise<{
    subscription_id: string
    ba_token?: string
    token?: string
    plan?: string
  }>
}

const Page = async ({ params, searchParams }: Props) => {
  const { orgId } = await params
  const { subscription_id, ba_token, token, plan } = await searchParams

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
                <Link href={`/o/${orgId}/overview`}>Return to Dashboard</Link>
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
      case "SUSPENDED":
        return <AlertTriangle className="h-16 w-16 text-yellow-500" />
      case "EXPIRED":
        return <Clock className="h-16 w-16 text-orange-500" />
      case "CANCELED":
        return <XCircle className="h-16 w-16 text-gray-500" />
      case "CREATED":
        return <Clock className="h-16 w-16 text-blue-500" />
      default:
        return <Clock className="h-16 w-16 text-blue-500" />
    }
  }

  const getStatusTitle = () => {
    switch (subscriptionStatus) {
      case "ACTIVE":
        return "Payment Successful!"
      case "CANCELED":
        return "Subscription Canceled"
      case "EXPIRED":
        return "Subscription Expired"
      case "SUSPENDED":
        return "Subscription Suspended"
      case "CREATED":
        return "Subscription Created"
      default:
        return "Payment Processing"
    }
  }

  const getStatusMessage = () => {
    switch (subscriptionStatus) {
      case "ACTIVE":
        return "Your subscription has been activated successfully. You now have access to all premium features."
      case "CANCELED":
        return "Your subscription has been canceled. You no longer have access to premium features."
      case "EXPIRED":
        return "Your subscription has expired. Please renew to continue accessing premium features."
      case "SUSPENDED":
        return "Your subscription is temporarily suspended. Please contact support for assistance."
      case "CREATED":
        return "Your subscription has been created and is being processed. This may take a few moments."
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

          {/* Success/Active Status Info */}
          {subscriptionStatus === "ACTIVE" && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h3 className="mb-2 font-semibold text-green-800">
                What happens now?
              </h3>
              <div className="space-y-2 text-sm text-green-700">
                <p>• Your subscription is now active and ready to use</p>
                <p>• All premium features are now available</p>
                <p>• You'll be billed according to your selected plan</p>
                <p>• You can manage your subscription from the billing page</p>
              </div>
            </div>
          )}

          {/* Processing/Created Status Info */}
          {subscriptionStatus === "CREATED" && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-800">
                Processing Your Payment
              </h3>
              <div className="space-y-2 text-sm text-blue-700">
                <p>• Your payment is being processed securely</p>
                <p>• This usually takes just a few moments</p>
                <p>• You'll receive a confirmation email once complete</p>
                <p>
                  • Please don't close this page until processing is complete
                </p>
              </div>
            </div>
          )}

          {/* Unknown/Default Status Info */}
          {!["ACTIVE", "CANCELED", "SUSPENDED", "EXPIRED", "CREATED"].includes(
            subscriptionStatus
          ) && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-800">
                Processing Your Payment
              </h3>
              <div className="space-y-2 text-sm text-blue-700">
                <p>• Your payment is being processed securely</p>
                <p>• This usually takes just a few moments</p>
                <p>• You'll receive a confirmation email once complete</p>
                <p>• Please refresh the page to check for updates</p>
              </div>
            </div>
          )}

          {/* Suspended Status Info */}
          {subscriptionStatus === "SUSPENDED" && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <h3 className="mb-2 font-semibold text-yellow-800">
                Subscription Suspended
              </h3>
              <div className="space-y-2 text-sm text-yellow-700">
                <p>• Your subscription has been temporarily suspended</p>
                <p>• This may be due to a payment issue or account review</p>
                <p>• Premium features are currently unavailable</p>
                <p>• Please contact support to resolve this issue</p>
              </div>
            </div>
          )}

          {/* Expired Status Info */}
          {subscriptionStatus === "EXPIRED" && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <h3 className="mb-2 font-semibold text-orange-800">
                Subscription Expired
              </h3>
              <div className="space-y-2 text-sm text-orange-700">
                <p>• Your subscription has expired and is no longer active</p>
                <p>• Premium features are no longer accessible</p>
                <p>• You can renew your subscription at any time</p>
                <p>• Your data and settings have been preserved</p>
              </div>
            </div>
          )}

          {/* Canceled Status Info */}
          {subscriptionStatus === "CANCELED" && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold text-gray-800">
                Subscription Canceled
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Your subscription has been canceled</p>
                <p>• Premium features are no longer accessible</p>
                <p>• No further charges will be made</p>
                <p>• You can subscribe again at any time</p>
              </div>
            </div>
          )}

          {/* Subscription Details Section */}
          {subscriptionDetails && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold text-gray-800">
                Subscription Details
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Plan:</strong>{" "}
                  {subscriptionDetails.plan || plan || "Invoice Pro"}
                </p>
                <p>
                  <strong>Status:</strong> {subscriptionDetails.status}
                </p>
                <p>
                  <strong>Subscription ID:</strong> {subscription_id}
                </p>
                {ba_token && (
                  <p>
                    <strong>Billing Agreement:</strong> {ba_token}
                  </p>
                )}
                {token && (
                  <p>
                    <strong>Transaction Token:</strong> {token}
                  </p>
                )}
                {subscriptionDetails.createdAt && (
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(
                      subscriptionDetails.createdAt
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href={`/o/${orgId}/billing/subscription`}>
                <CreditCard className="mr-2 h-4 w-4" />
                View Billing
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href={`/o/${orgId}/overview`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
          </div>

          {/* Action buttons for specific statuses */}
          {/* {(subscriptionStatus === "EXPIRED" ||
            subscriptionStatus === "CANCELED") && (
            <div className="text-center">
              <Button asChild>
                <Link href={`/o/${orgId}/billing/subscription`}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscribe Again
                </Link>
              </Button>
            </div>
          )} */}

          {subscriptionStatus === "SUSPENDED" && (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Need help resolving this issue?{" "}
                <Link href="/support" className="text-blue-600 hover:underline">
                  Contact our support team
                </Link>
              </p>
            </div>
          )}

          {/* General support link */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <Link href="/support" className="text-blue-600 hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
