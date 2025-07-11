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
import { BuildingIcon, CheckIcon, CreditCardIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { generatePlanFeatures } from "../billing/utils"

type Props = {
  subscription: SubscriptionSchemaT
  currentPlan: PlanSchemaT
  getStatusColor: (status: string) => string
}

type StatusConfig = {
  icon: React.ReactNode
  title: string
  description: string
  bgColor: string
  textColor: string
  iconColor: string
  message: string
  messageDescription: string
}

const PlanDetails = ({
  currentPlan,
  subscription,
  getStatusColor,
  t,
}: {
  currentPlan: PlanSchemaT
  subscription: SubscriptionSchemaT
  getStatusColor: (status: string) => string
  t: any
}) => (
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
      <span className="font-medium">{t("Price")}</span>
      <span className="text-lg font-semibold">
        ${currentPlan.monthlyPrice}/month
      </span>
    </div>

    <Separator />
  </>
)

const PlanFeatures = ({
  currentPlan,
  t,
}: {
  currentPlan: PlanSchemaT
  t: any
}) => (
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
)

const StatusAlert = ({ config, t }: { config: StatusConfig; t: any }) => (
  <div className={`rounded-lg p-4 ${config.bgColor}`}>
    <div className="flex items-start gap-3">
      <CreditCardIcon className={`mt-0.5 h-5 w-5 ${config.iconColor}`} />
      <div>
        <h4 className={`font-medium ${config.textColor}`}>{config.message}</h4>
        <p className={`mt-1 text-sm ${config.textColor.replace("800", "700")}`}>
          {config.messageDescription}
        </p>
      </div>
    </div>
  </div>
)

const CurrentPlanCard = ({
  subscription,
  currentPlan,
  getStatusColor,
}: Props) => {
  const t = useTranslations()

  const statusConfigs: Record<string, StatusConfig> = {
    ACTIVE: {
      icon: <BuildingIcon className="h-5 w-5" />,
      title: t("Current Plan"),
      description: t("Your current subscription details"),
      bgColor: "",
      textColor: "",
      iconColor: "",
      message: "",
      messageDescription: "",
    },
    SUSPENDED: {
      icon: <CreditCardIcon className="h-6 w-6 text-yellow-500" />,
      title: t("Subscription Suspended"),
      description: t("Your subscription has been suspended"),
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
      message: t("Subscription Suspended"),
      messageDescription: t("Payment issue or expired card"),
    },
    EXPIRED: {
      icon: <CreditCardIcon className="h-6 w-6 text-orange-500" />,
      title: t("Subscription Expired"),
      description: t("Your subscription has expired"),
      bgColor: "bg-orange-50",
      textColor: "text-orange-800",
      iconColor: "text-orange-600",
      message: t("Subscription Expired"),
      messageDescription: t("Subscription was cancelled or expired"),
    },
    CANCELED: {
      icon: <CreditCardIcon className="h-6 w-6 text-red-500" />,
      title: t("Subscription Canceled"),
      description: t("Your subscription has been canceled"),
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      iconColor: "text-red-600",
      message: t("Subscription Canceled"),
      messageDescription: t("Your subscription has been canceled"),
    },
    CREATED: {
      icon: <CreditCardIcon className="h-6 w-6 text-blue-500" />,
      title: t("Subscription Created"),
      description: t("Your subscription is being processed"),
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
      message: t("Subscription Created"),
      messageDescription: t(
        "Your subscription is being processed and will be active shortly"
      ),
    },
  }

  const config = statusConfigs[subscription.status] || {
    icon: <CreditCardIcon className="h-6 w-6 text-gray-500" />,
    title: t("Plan Status"),
    description: t("No active subscription"),
    bgColor: "bg-gray-50",
    textColor: "text-gray-800",
    iconColor: "text-gray-600",
    message: t("Plan Status"),
    messageDescription: t("No active subscription"),
  }

  const isActive = subscription.status === "ACTIVE"
  const needsAlert = ["SUSPENDED", "EXPIRED", "CANCELED", "CREATED"].includes(
    subscription.status
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {config.icon}
          {config.title}
        </CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PlanDetails
          currentPlan={currentPlan}
          subscription={subscription}
          getStatusColor={getStatusColor}
          t={t}
        />

        {isActive && <PlanFeatures currentPlan={currentPlan} t={t} />}

        {needsAlert && <StatusAlert config={config} t={t} />}
      </CardContent>
    </Card>
  )
}

export { CurrentPlanCard }
