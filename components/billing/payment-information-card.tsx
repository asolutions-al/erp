"use client"

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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SubscriptionSchemaT } from "@/db/app/schema"
import { PlanSchemaT } from "@/db/auth/schema"
import { CalendarIcon, CreditCardIcon, XCircleIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  subscription: SubscriptionSchemaT
  currentPlan: PlanSchemaT
  cancelSubscription: () => Promise<ResT<true>>
}

export const PaymentInformationCard = ({
  subscription,
  currentPlan,
  cancelSubscription,
}: Props) => {
  const t = useTranslations()
  const { orgId } = useParams()
  const router = useRouter()
  const [isCanceling, setIsCanceling] = useState(false)

  if (subscription.status !== "ACTIVE") {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCardIcon className="h-5 w-5" />
          {t("Payment Information")}
        </CardTitle>
        <CardDescription>
          {t("Your payment method and billing details")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription.paymentProvider && (
          <div className="flex items-center justify-between">
            <span className="font-medium">{t("Payment Provider")}</span>
            <span className="capitalize">{subscription.paymentProvider}</span>
          </div>
        )}

        {subscription.externalSubscriptionId && (
          <div className="flex items-center justify-between">
            <span className="font-medium">{t("Subscription ID")}</span>
            <span className="font-mono text-sm text-muted-foreground">
              {subscription.externalSubscriptionId}
            </span>
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium">{t("Billing Actions")}</h4>

          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" disabled>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {t("View Billing History")}
              <Badge variant="outline" className="ml-auto">
                {t("Coming soon")}
              </Badge>
            </Button>

            <Button variant="outline" className="w-full justify-start" disabled>
              <CreditCardIcon className="mr-2 h-4 w-4" />
              {t("Update Payment Method")}
              <Badge variant="outline" className="ml-auto">
                {t("Coming soon")}
              </Badge>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  disabled={isCanceling || currentPlan.id === "INVOICE-STARTER"}
                >
                  <XCircleIcon className="mr-2 h-4 w-4" />
                  {isCanceling
                    ? t("Canceling")
                    : currentPlan.id === "INVOICE-STARTER"
                      ? t("Cannot Cancel Free Plan")
                      : t("Cancel Subscription")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("Cancel Subscription")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(
                      "Are you sure you want to cancel your subscription? This action cannot be undone and you will lose access to all premium features"
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("Keep Subscription")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      setIsCanceling(true)
                      const res = await cancelSubscription()
                      if (res.error) toast.error(res.error.message)
                      if (res.success) {
                        router.push(
                          `/o/${orgId}/billing/subscription/cancellation/pending?subscription_id=${subscription.externalSubscriptionId}&plan=${currentPlan.name}`
                        )
                      }
                      setIsCanceling(false)
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {t("Yes, Cancel Subscription")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
