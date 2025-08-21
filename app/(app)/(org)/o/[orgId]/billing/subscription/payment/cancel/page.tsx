import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, XCircle } from "lucide-react"
import Link from "next/link"

type Props = {
  params: Promise<{ orgId: string }>
  searchParams: Promise<{
    subscription_id?: string
    ba_token?: string
    token?: string
  }>
}

const Page = async ({ params, searchParams }: Props) => {
  const { orgId } = await params
  const { subscription_id, ba_token, token } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="pb-6 text-center">
          <div className="mb-4 flex justify-center">
            <XCircle className="h-16 w-16 text-orange-500" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Subscription Cancelled
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="mb-4 text-gray-600">
              You have cancelled the subscription process. No payment has been
              charged and no subscription has been created.
            </p>

            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <h3 className="mb-2 font-semibold text-orange-800">
                What happens next?
              </h3>
              <div className="space-y-2 text-sm text-orange-700">
                <p>• No charges have been made to your account</p>
                <p>• You can still try subscribing again at any time</p>
                <p>• Your account remains active with current limitations</p>
              </div>
            </div>
          </div>

          {subscription_id && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold text-gray-800">
                Cancelled Process Details
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Subscription ID:</strong> {subscription_id}
                </p>
                {ba_token && (
                  <p>
                    <strong>Billing Agreement Token:</strong> {ba_token}
                  </p>
                )}
                {token && (
                  <p>
                    <strong>Transaction Token:</strong> {token}
                  </p>
                )}
                <p>
                  <strong>Status:</strong> Cancelled by user
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href={`/o/${orgId}/billing/subscription`}>
                <CreditCard className="mr-2 h-4 w-4" />
                Try Again
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href={`/o/${orgId}/overview`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
          </div>

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
