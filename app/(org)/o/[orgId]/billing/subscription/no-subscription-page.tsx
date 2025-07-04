"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CheckIcon, CreditCardIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

type Props = {
  orgId: string
}

const planFeatures = {
  "INVOICE-STARTER": [
    "Up to 100 invoices per month",
    "Basic reporting",
    "Email support",
    "1 organization",
    "Up to 5 units",
  ],
  "INVOICE-PRO": [
    "Up to 1000 invoices per month",
    "Advanced reporting",
    "Priority support",
    "Multiple organizations",
    "Unlimited units",
    "Custom branding",
    "API access",
  ],
  "INVOICE-BUSINESS": [
    "Unlimited invoices",
    "Enterprise reporting",
    "24/7 support",
    "Multiple organizations",
    "Unlimited units",
    "Custom branding",
    "API access",
    "White-label solution",
    "Dedicated account manager",
  ],
}

const planPricing = {
  "INVOICE-STARTER": { monthly: 9.99, yearly: 99.99 },
  "INVOICE-PRO": { monthly: 29.99, yearly: 299.99 },
  "INVOICE-BUSINESS": { monthly: 99.99, yearly: 999.99 },
}

const paypalPlanIds: Record<string, string> = {
  "INVOICE-STARTER": "P-8H940073V81075441NBTO64Y", // Replace with your actual plan IDs if you have more
  "INVOICE-PRO": "P-8H940073V81075441NBTO64Y",
  "INVOICE-BUSINESS": "P-8H940073V81075441NBTO64Y",
}

export const NoSubscriptionPage = ({ orgId }: Props) => {
  const t = useTranslations()
  const router = useRouter()

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

  const handleSubscribe = async (plan: string) => {
    const planId = paypalPlanIds[plan]
    const res = await fetch("/api/paypal/create-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId, planId, plan }),
    })
    const { approvalUrl } = await res.json()
    if (approvalUrl) {
      window.location.href = approvalUrl
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("Billing")}</h1>
        <p className="text-muted-foreground">
          {t("Choose a plan to get started with your subscription")}
        </p>
      </div>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5" />
            {t("Available Plans")}
          </CardTitle>
          <CardDescription>
            {t("Choose the plan that best fits your needs")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(planPricing).map(([plan, pricing]) => (
              <Card key={plan} className="relative">
                <CardHeader>
                  <CardTitle className="text-center">
                    {getPlanDisplayName(plan)}
                  </CardTitle>
                  <CardDescription className="text-center">
                    ${pricing.monthly}/month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {planFeatures[plan as keyof typeof planFeatures].map(
                      (feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckIcon className="h-4 w-4 text-green-500" />
                          {/* {t(feature)} */}
                          {feature}
                        </li>
                      )
                    )}
                  </ul>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => handleSubscribe(plan)}
                  >
                    {t("Subscribe with PayPal")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
