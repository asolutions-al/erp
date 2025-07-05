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
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type PlanId = (typeof planId.enumValues)[number]

type Props = {
  subscription: SubscriptionSchemaT
  plans: PlanSchemaT[]
  changePlan: (planId: PlanId) => Promise<ResT<true>>
  cancelSubscription: () => Promise<ResT<true>>
  reactivateSubscription: () => Promise<
    ResT<{
      approvalUrl: string
    }>
  >
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
  changePlan,
  cancelSubscription,
  reactivateSubscription,
}: Props) => {
  const t = useTranslations()
  const { orgId } = useParams()
  const router = useRouter()
  const [isCanceling, setIsCanceling] = useState(false)
  const [isReactivating, setIsReactivating] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null)
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] =
    useState<PlanSchemaT | null>(null)
  const [selectedPlanForDowngrade, setSelectedPlanForDowngrade] =
    useState<PlanSchemaT | null>(null)

  const currentPlan = plans.find((plan) => plan.id === subscription.plan)!

  const handlePlanChange = async (planId: string) => {
    setIsUpgrading(planId)
    try {
      const response = await fetch("/api/paypal/upgrade-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orgId,
          planId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.approvalUrl) {
          // Redirect to PayPal for subscription revision approval
          toast.info("Redirecting to PayPal to approve your plan change...")
          window.location.href = data.approvalUrl
        } else {
          toast.success("Plan change completed successfully")
          router.refresh()
        }
      } else {
        toast.error(data.error || "Failed to change subscription plan")
      }
    } catch (error) {
      console.error("Error changing subscription plan:", error)
      toast.error("An error occurred while changing subscription plan")
    } finally {
      setIsUpgrading(null)
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
              <span className="text-lg font-semibold">{currentPlan.name}</span>
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
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
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
                          onClick={async () => {
                            setIsCanceling(true)
                            const res = await cancelSubscription()
                            if (res.error) toast.error(res.error.message)
                            if (res.success) {
                              toast.success(
                                t("Subscription cancelled successfully")
                              )
                              router.refresh()
                            }
                          }}
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
                          onClick={async () => {
                            setIsReactivating(true)
                            const res = await reactivateSubscription()
                            if (res.error) toast.error(res.error.message)

                            if (res.success) {
                              const { approvalUrl } = res.success.data
                              window.location.href = approvalUrl
                            }
                            setIsReactivating(false)
                          }}
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
            {t("Choose the plan that best fits your needs")}. Plan changes are
            processed immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const isActive = subscription.plan === plan.id
              const canUpgrade = plan.tier > currentPlan.tier
              const isDowngrade = plan.tier < currentPlan.tier

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
                      variant={
                        isActive
                          ? "outline"
                          : canUpgrade
                            ? "default"
                            : "secondary"
                      }
                      disabled={isActive || isUpgrading === plan.id}
                      onClick={() => {
                        if (canUpgrade) {
                          setSelectedPlanForUpgrade(plan)
                        } else if (isDowngrade) {
                          setSelectedPlanForDowngrade(plan)
                        }
                      }}
                    >
                      {isActive
                        ? t("Current Plan")
                        : isUpgrading === plan.id
                          ? "Processing..."
                          : isDowngrade
                            ? "Downgrade"
                            : t("Upgrade")}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Confirmation Dialog */}
      {selectedPlanForUpgrade && (
        <AlertDialog
          open={!!selectedPlanForUpgrade}
          onOpenChange={() => setSelectedPlanForUpgrade(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Upgrade to {selectedPlanForUpgrade.name}
              </AlertDialogTitle>
              <AlertDialogDescription>
                You are about to upgrade your subscription to the{" "}
                {selectedPlanForUpgrade.name} plan for $
                {selectedPlanForUpgrade.monthlyPrice}/month.
                <br />
                <br />
                Your current subscription will be modified to the new plan, and
                you'll only pay the difference. The change takes effect
                immediately upon approval.
                <br />
                <br />
                Your new plan will include:
                <ul className="mt-2 space-y-1">
                  {generatePlanFeatures(selectedPlanForUpgrade).map(
                    (feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckIcon className="h-3 w-3 text-green-500" />
                        {feature}
                      </li>
                    )
                  )}
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setSelectedPlanForUpgrade(null)}
              >
                {t("Cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handlePlanChange(selectedPlanForUpgrade.id)
                  // changePlan(selectedPlanForUpgrade.id)
                  setSelectedPlanForUpgrade(null)
                }}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isUpgrading === selectedPlanForUpgrade.id}
              >
                {isUpgrading === selectedPlanForUpgrade.id
                  ? "Processing..."
                  : "Upgrade Now"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Downgrade Confirmation Dialog */}
      {selectedPlanForDowngrade && (
        <AlertDialog
          open={!!selectedPlanForDowngrade}
          onOpenChange={() => setSelectedPlanForDowngrade(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Downgrade to {selectedPlanForDowngrade.name}
              </AlertDialogTitle>
              <AlertDialogDescription>
                You are about to downgrade your subscription to the{" "}
                {selectedPlanForDowngrade.name} plan for $
                {selectedPlanForDowngrade.monthlyPrice}/month.
                <br />
                <br />
                <strong>Important:</strong> Downgrading will reduce your plan
                limits. Please ensure you're not exceeding the new plan's limits
                before proceeding. The change takes effect immediately upon
                approval.
                <br />
                <br />
                Your new plan will include:
                <ul className="mt-2 space-y-1">
                  {generatePlanFeatures(selectedPlanForDowngrade).map(
                    (feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckIcon className="h-3 w-3 text-green-500" />
                        {feature}
                      </li>
                    )
                  )}
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setSelectedPlanForDowngrade(null)}
              >
                {t("Cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  // handlePlanChange(selectedPlanForDowngrade.id)
                  changePlan(selectedPlanForDowngrade.id)
                  setSelectedPlanForDowngrade(null)
                }}
                className="bg-orange-600 hover:bg-orange-700"
                disabled={isUpgrading === selectedPlanForDowngrade.id}
              >
                {isUpgrading === selectedPlanForDowngrade.id
                  ? "Processing..."
                  : "Downgrade Now"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
