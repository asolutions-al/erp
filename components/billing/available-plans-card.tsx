"use client"

import { PlanCard } from "@/components/cards"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SubscriptionSchemaT } from "@/db/app/schema"
import { PlanSchemaT } from "@/db/auth/schema"
import { planId } from "@/orm/auth/schema"
import { CreditCardIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
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
  switchToStarterPlan: () => Promise<ResT<true>>
}

export const AvailablePlansCard = ({
  subscription,
  plans,
  createSubscription,
  switchToStarterPlan,
}: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const [processingPlanId, setProcessingPlanId] = useState<PlanId | null>(null)

  const handleCreateSubscription = async (planId: PlanId) => {
    setProcessingPlanId(planId)
    const res = await createSubscription(planId)
    if (res.error) {
      toast.error(res.error.message)
    }
    if (res.success) {
      const { approvalUrl } = res.success.data
      window.location.href = approvalUrl
    }
    setProcessingPlanId(null)
  }

  const handleSwitchToStarter = async () => {
    setProcessingPlanId("INVOICE-STARTER")
    const res = await switchToStarterPlan()
    if (res.error) {
      toast.error(res.error.message)
    }
    if (res.success) {
      toast.success(t("Successfully switched to starter plan"))
      router.refresh()
    }
    setProcessingPlanId(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCardIcon size={20} />
          {t("Available Plans")}
        </CardTitle>
        <CardDescription>
          {subscription.status === "ACTIVE"
            ? subscription.plan === "INVOICE-STARTER"
              ? t("Upgrade to unlock more features")
              : "You are currently subscribed to a plan"
            : "Choose a plan to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const isActive =
              subscription.plan === plan.id && subscription.status === "ACTIVE"

            // Allow subscription if no active subscription OR if current plan is STARTER and upgrading to PRO/BUSINESS
            // Also allow switching to starter plan if subscription is not active and not already starter
            const canSubscribe =
              subscription.status !== "ACTIVE" ||
              (subscription.status === "ACTIVE" &&
                subscription.plan === "INVOICE-STARTER" &&
                (plan.id === "INVOICE-PRO" ||
                  plan.id === "INVOICE-BUSINESS")) ||
              (subscription.status !== "ACTIVE" &&
                plan.id === "INVOICE-STARTER" &&
                subscription.plan !== "INVOICE-STARTER")

            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                isActive={isActive}
                canSubscribe={canSubscribe}
                isProcessing={processingPlanId === plan.id}
                onSubscribe={() =>
                  plan.id === "INVOICE-STARTER"
                    ? handleSwitchToStarter()
                    : handleCreateSubscription(plan.id)
                }
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
