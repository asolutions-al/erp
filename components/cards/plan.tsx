"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PlanSchemaT } from "@/db/auth/schema"
import { CheckIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { generatePlanFeatures } from "../billing"

type Props = {
  plan: PlanSchemaT
  isActive: boolean
  canSubscribe: boolean
  isProcessing: boolean
  onSubscribe: () => void
}

const PlanCard = ({
  plan,
  isActive,
  canSubscribe,
  isProcessing,
  onSubscribe,
}: Props) => {
  const t = useTranslations()

  return (
    <Card
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
          <Badge className="bg-blue-500 text-white">{t("Current")}</Badge>
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
            <li key={index} className="flex items-center gap-2 text-sm">
              <CheckIcon className="h-4 w-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          className="mt-4 w-full"
          variant={isActive ? "outline" : "default"}
          disabled={isActive || !canSubscribe || isProcessing}
          onClick={onSubscribe}
        >
          <BtnText
            plan={plan}
            isActive={isActive}
            canSubscribe={canSubscribe}
            isProcessing={isProcessing}
          />
        </Button>
      </CardContent>
    </Card>
  )
}

const BtnText = ({
  plan,
  canSubscribe,
  isActive,
  isProcessing,
}: {
  plan: PlanSchemaT
  isActive: boolean
  canSubscribe: boolean
  isProcessing: boolean
}) => {
  const t = useTranslations()
  if (isActive) return t("Current Plan")
  if (isProcessing) return t("Processing")
  if (!canSubscribe) return t("Not Available")

  // USER CAN SUBSCRIBE TO A PLAN

  if (plan.id === "INVOICE-STARTER") return t("Select Starter Plan")

  return t("Subscribe Now")
}

export { PlanCard }
