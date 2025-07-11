"use client"

import {
  AvailablePlansCard,
  CurrentPlanCard,
  getStatusColor,
  PaymentInformationCard,
} from "@/components/billing"
import { SubscriptionSchemaT } from "@/db/app/schema"
import { PlanSchemaT } from "@/db/auth/schema"
import { planId } from "@/orm/auth/schema"
import { useTranslations } from "next-intl"

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
  switchToStarterPlan: () => Promise<ResT<true>>
}

export const BillingPage = ({
  subscription,
  plans,
  createSubscription,
  cancelSubscription,
  switchToStarterPlan,
}: Props) => {
  const t = useTranslations()
  const currentPlan =
    plans.find((plan) => plan.id === subscription.plan) || plans[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("Billing")}</h1>
        <p className="text-muted-foreground">
          {t("Manage your subscription and billing information")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CurrentPlanCard
          subscription={subscription}
          currentPlan={currentPlan}
          getStatusColor={getStatusColor}
        />

        <PaymentInformationCard
          subscription={subscription}
          currentPlan={currentPlan}
          cancelSubscription={cancelSubscription}
          switchToStarterPlan={switchToStarterPlan}
        />
      </div>

      <AvailablePlansCard
        subscription={subscription}
        plans={plans}
        createSubscription={createSubscription}
        switchToStarterPlan={switchToStarterPlan}
      />
    </div>
  )
}
