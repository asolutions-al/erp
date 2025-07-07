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
import { formatDate } from "@/lib/utils"
import { planId } from "@/orm/auth/schema"
import {
  BuildingIcon,
  CalendarIcon,
  CheckIcon,
  CreditCardIcon,
  XCircleIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type PlanId = (typeof planId.enumValues)[number]

type Props = {
  subscription: SubscriptionSchemaT
  plans: PlanSchemaT[]
  createSubscription: (planId: PlanId) => Promise<
    ResT<{
      approvalUrl: string
    }>
  >
  cancelSubscription: () => Promise<ResT<true>>
}

const generatePlanFeatures = (planData: PlanSchemaT) => {
  const features = []

  if (planData.maxInvoices === -1) {
    features.push("Unlimited invoices")
  } else {
    features.push(
      `Up to ${planData.maxInvoices.toLocaleString()} invoices per month`
    )
  }

  if (planData.maxUnits === -1) {
    features.push("Unlimited units")
  } else {
    features.push(`Up to ${planData.maxUnits} units`)
  }

  if (planData.maxMembers === -1) {
    features.push("Unlimited team members")
  } else {
    features.push(`Up to ${planData.maxMembers} team members`)
  }

  if (planData.maxCustomers === -1) {
    features.push("Unlimited customers")
  } else {
    features.push(`Up to ${planData.maxCustomers.toLocaleString()} customers`)
  }

  if (planData.maxProducts === -1) {
    features.push("Unlimited products")
  } else {
    features.push(`Up to ${planData.maxProducts.toLocaleString()} products`)
  }

  return features
}

export const BillingPage = ({
  subscription,
  plans,
  createSubscription,
  cancelSubscription,
}: Props) => {
  const t = useTranslations()
  const { orgId } = useParams()
  const router = useRouter()
  const [isCanceling, setIsCanceling] = useState(false)
  const [isCreating, setIsCreating] = useState<string | null>(null)

  const currentPlan =
    plans.find((plan) => plan.id === subscription.plan) || plans[0]

  const handleCreateSubscription = async (planId: PlanId) => {
    setIsCreating(planId)
    const res = await createSubscription(planId)
    if (res.error) {
      toast.error(res.error.message)
    }
    if (res.success) {
      const { approvalUrl } = res.success.data
      window.location.href = approvalUrl
    }
    setIsCreating(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "CANCELED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("Billing")}</h1>
        <p className="text-muted-foreground">
          {t("Manage your subscription and billing information")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BuildingIcon className="h-5 w-5" />
              {subscription.status === "ACTIVE"
                ? t("Current Plan")
                : "Plan Status"}
            </CardTitle>
            <CardDescription>
              {subscription.status === "ACTIVE"
                ? t("Your current subscription details")
                : "No active subscription"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription.status === "ACTIVE" && (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t("Plan")}</span>
                  <span className="text-lg font-semibold">
                    {currentPlan.name}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">{t("Status")}</span>
                  <Badge className={getStatusColor(subscription.status)}>
                    {t(subscription.status)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">{t("Started")}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(new Date(subscription.startedAt))}
                  </span>
                </div>

                {subscription.canceledAt && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t("Canceled")}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(new Date(subscription.canceledAt))}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-medium">{t("Price")}</span>
                  <span className="text-lg font-semibold">
                    ${currentPlan.monthlyPrice}/month
                  </span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">{t("Plan Features")}</h4>
                  <ul className="space-y-1">
                    {generatePlanFeatures(currentPlan).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckIcon className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {subscription.status !== "ACTIVE" && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <CreditCardIcon className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  {t("No Active Subscription")}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {t("You don't have an active subscription")}.{" "}
                  {t(
                    "Choose a plan below to unlock premium features and get started"
                  )}
                  .
                </p>
                <Badge className={getStatusColor(subscription.status)}>
                  {subscription.status === "CANCELED"
                    ? t("No Subscription")
                    : t(subscription.status)}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Information Card - Only show for active subscriptions */}
        {subscription.status === "ACTIVE" && (
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
                  <span className="capitalize">
                    {subscription.paymentProvider}
                  </span>
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
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    disabled
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {t("View Billing History")}
                    <Badge variant="outline" className="ml-auto">
                      {t("Coming soon")}
                    </Badge>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    disabled
                  >
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
                        disabled={isCanceling}
                      >
                        <XCircleIcon className="mr-2 h-4 w-4" />
                        {isCanceling
                          ? t("Canceling")
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
        )}
      </div>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>{t("Available Plans")}</CardTitle>
          <CardDescription>
            {subscription.status === "ACTIVE"
              ? "You are currently subscribed to a plan"
              : "Choose a plan to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const isActive =
                subscription.plan === plan.id &&
                subscription.status === "ACTIVE"
              const canSubscribe = subscription.status !== "ACTIVE" // Allow subscription for non-active status

              return (
                <Card
                  key={plan.id}
                  className={`relative ${
                    isActive
                      ? "border-2 border-blue-500 shadow-lg"
                      : plan.id === "INVOICE-PRO"
                        ? "border-2 border-green-500 shadow-md"
                        : ""
                  }`}
                >
                  {isActive && (
                    <div className="absolute -right-2 -top-2">
                      <Badge className="bg-blue-500 text-white">
                        {t("Current")}
                      </Badge>
                    </div>
                  )}
                  {plan.id === "INVOICE-PRO" && !isActive && (
                    <div className="absolute -left-2 -top-2">
                      <Badge className="bg-green-500 text-white">Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-center">{plan.name}</CardTitle>
                    <CardDescription className="text-center">
                      ${plan.monthlyPrice}/month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {generatePlanFeatures(plan).map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckIcon className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="mt-4 w-full"
                      variant={isActive ? "outline" : "default"}
                      disabled={
                        isActive || !canSubscribe || isCreating === plan.id
                      }
                      onClick={() => {
                        if (canSubscribe) {
                          handleCreateSubscription(plan.id)
                        }
                      }}
                    >
                      {isActive
                        ? t("Current Plan")
                        : isCreating === plan.id
                          ? "Processing..."
                          : canSubscribe
                            ? "Subscribe"
                            : "Not Available"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
