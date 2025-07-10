"use client"

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
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { PlanCard } from "./plan-card"

type PlanId = (typeof planId.enumValues)[number]

type Props = {
  subscription: SubscriptionSchemaT
  plans: PlanSchemaT[]
  createSubscription: (planId: PlanId) => Promise<
    ResT<{
      approvalUrl: string
    }>
  >
  generatePlanFeatures: (plan: PlanSchemaT) => string[]
}

export const AvailablePlansCard = ({
  subscription,
  plans,
  createSubscription,
  generatePlanFeatures,
}: Props) => {
  const t = useTranslations()
  const [isCreating, setIsCreating] = useState<string | null>(null)

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

  return (
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
            const canSubscribe = subscription.status !== "ACTIVE"

            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                isActive={isActive}
                canSubscribe={canSubscribe}
                isCreating={isCreating === plan.id}
                onSubscribe={() => {
                  if (canSubscribe) {
                    handleCreateSubscription(plan.id)
                  }
                }}
                generatePlanFeatures={generatePlanFeatures}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
