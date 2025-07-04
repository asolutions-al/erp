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
import { formatDate } from "@/lib/utils"
import { plan } from "@/orm/auth/schema"
import {
  BuildingIcon,
  CalendarIcon,
  CheckIcon,
  CreditCardIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type Subscription = {
  id: string
  createdAt: string
  orgId: string
  plan: "INVOICE-STARTER" | "INVOICE-PRO" | "INVOICE-BUSINESS"
  status: "ACTIVE" | "CANCELED"
  startedAt: string
  canceledAt?: string
  paymentProvider?: "PAYPAL"
  externalSubscriptionId?: string
}

type Props = {
  subscription: SubscriptionSchemaT
  plans: (typeof plan.$inferSelect)[]
}

export const BillingPage = ({ subscription, plans }: Props) => {
  const t = useTranslations()
  const { orgId } = useParams()
  const router = useRouter()
  const [isCanceling, setIsCanceling] = useState(false)
  const [isReactivating, setIsReactivating] = useState(false)

  // Create a map of plans by ID for easy lookup
  const planMap = plans.reduce(
    (acc, plan) => {
      acc[plan.id] = plan
      return acc
    },
    {} as Record<string, (typeof plans)[0]>
  )

  // Generate features based on plan data
  const generatePlanFeatures = (planData: (typeof plans)[0]) => {
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

  const handleCancelSubscription = async () => {
    setIsCanceling(true)
    try {
      const response = await fetch("/api/paypal/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orgId,
          reason: "User requested cancellation via billing page",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(t("Subscription cancelled successfully"))
        router.refresh()
      } else {
        toast.error(data.error || t("Failed to cancel subscription"))
      }
    } catch (error) {
      console.error("Error canceling subscription:", error)
      toast.error(t("An error occurred while canceling subscription"))
    } finally {
      setIsCanceling(false)
    }
  }

  const handleReactivateSubscription = async () => {
    setIsReactivating(true)
    try {
      const response = await fetch("/api/paypal/reactivate-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orgId,
          reason: "User requested reactivation via billing page",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.requiresApproval && data.approvalUrl) {
          // Redirect to PayPal for approval
          window.location.href = data.approvalUrl
        } else {
          toast.success(t("Subscription reactivated successfully"))
          router.refresh()
        }
      } else {
        toast.error(data.error || t("Failed to reactivate subscription"))
      }
    } catch (error) {
      console.error("Error reactivating subscription:", error)
      toast.error(t("An error occurred while reactivating subscription"))
    } finally {
      setIsReactivating(false)
    }
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

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case "INVOICE-STARTER":
        return "Starter"
      case "INVOICE-PRO":
        return "Pro"
      case "INVOICE-BUSINESS":
        return "Business"
      default:
        return plan
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
              {t("Current Plan")}
            </CardTitle>
            <CardDescription>
              {t("Your current subscription details")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{t("Plan")}</span>
              <span className="text-lg font-semibold">
                {getPlanDisplayName(subscription.plan)}
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
                ${planMap[subscription.plan]?.monthlyPrice}/month
              </span>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium">{t("Plan Features")}</h4>
              <ul className="space-y-1">
                {planMap[subscription.plan] &&
                  generatePlanFeatures(planMap[subscription.plan]).map(
                    (feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckIcon className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    )
                  )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information Card */}
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
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {t("View Billing History")}
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <CreditCardIcon className="mr-2 h-4 w-4" />
                  {t("Update Payment Method")}
                </Button>

                {subscription.status === "ACTIVE" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full justify-start"
                        disabled={isCanceling}
                      >
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
                          onClick={handleCancelSubscription}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {t("Yes, Cancel Subscription")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {subscription.status === "CANCELED" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="w-full justify-start"
                        disabled={isReactivating}
                      >
                        {isReactivating
                          ? t("Reactivating")
                          : t("Reactivate Subscription")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("Reactivate Subscription")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t(
                            "To reactivate your subscription, you will be redirected to PayPal to approve a new subscription with the same plan"
                          )}
                          .
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleReactivateSubscription}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {t("Yes, Reactivate Subscription")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>{t("Available Plans")}</CardTitle>
          <CardDescription>
            {t("Choose the plan that best fits your needs")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const isActive = subscription.plan === plan.id
              return (
                <Card key={plan.id} className="relative">
                  {isActive && (
                    <div className="absolute -right-2 -top-2">
                      <Badge className="bg-blue-500 text-white">
                        {t("Current")}
                      </Badge>
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
                      disabled={isActive}
                    >
                      {isActive ? t("Current Plan") : t("Upgrade")}
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
