import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import Link from "next/link"

type Props = {
  params: Promise<{ orgId: string }>
  searchParams: Promise<{
    subscription_id?: string
  }>
}

const Page = async ({ params, searchParams }: Props) => {
  const { orgId } = await params
  const { subscription_id } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="pb-6 text-center">
          <div className="mb-4 flex justify-center">
            <Clock className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Cancellation Pending
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="mb-4 text-gray-600">
              Your subscription cancellation request has been submitted
              successfully. We're processing your cancellation and will confirm
              it shortly.
            </p>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="mb-2 font-semibold text-yellow-800">
              What happens next?
            </h3>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• Your cancellation request is being processed</li>
              <li>• You'll receive an email confirmation once it's complete</li>
              <li>• You can reactivate your subscription at any time</li>
            </ul>
          </div>

          {subscription_id && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold text-gray-800">
                Cancellation Details
              </h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <strong>Status:</strong> Cancellation Pending
                </p>
                <p>
                  <strong>Requested:</strong> {new Date().toLocaleDateString()}
                </p>
                {subscription_id && (
                  <p>
                    <strong>Subscription ID:</strong> {subscription_id}
                  </p>
                )}
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
              <Link href={`/o/${orgId}/overview`}>Return to Dashboard</Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team if you have any questions
              about your cancellation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
