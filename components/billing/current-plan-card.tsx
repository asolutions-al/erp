"use client"

import { Badge } from "@/components/ui/badge"
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
import { BuildingIcon, CheckIcon, CreditCardIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { generatePlanFeatures } from "./utils"

type Props = {
  subscription: SubscriptionSchemaT
  currentPlan: PlanSchemaT
  getStatusColor: (status: string) => string
}

export const CurrentPlanCard = ({
  subscription,
  currentPlan,
  getStatusColor,
}: Props) => {
  const t = useTranslations()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BuildingIcon className="h-5 w-5" />
          {subscription.status === "ACTIVE" ? t("Current Plan") : "Plan Status"}
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
  )
}
