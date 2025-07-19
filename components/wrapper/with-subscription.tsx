import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getSubscriptionByOrgId } from "@/db/app/actions/subscription"
import { getCustomerCount } from "@/db/app/loaders/customer"
import { getInvoiceMonthCount } from "@/db/app/loaders/invoice"
import { getProductCount } from "@/db/app/loaders/product"
import { getUnitCount } from "@/db/app/loaders/unit"
import { getPlans } from "@/db/auth/loaders/plan"
import { PlanSchemaT } from "@/db/auth/schema"
import {
  AlertTriangleIcon,
  ArrowUpIcon,
  CreditCardIcon,
  LockIcon,
  XCircleIcon,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { PropsWithChildren } from "react"

type Entity = "UNIT" | "PRODUCT" | "CUSTOMER" | "INVOICE"

type Props = {
  orgId: string
  unitId: string | null
  entity: Entity
}

const getCountFn = (props: Props) => {
  const MAP: Record<Entity, () => Promise<number>> = {
    UNIT: async () => getUnitCount({ orgId: props.orgId }),
    PRODUCT: async () =>
      getProductCount({ orgId: props.orgId, unitId: props.unitId! }),
    CUSTOMER: async () =>
      getCustomerCount({ orgId: props.orgId, unitId: props.unitId! }),
    INVOICE: async () =>
      getInvoiceMonthCount({ orgId: props.orgId, unitId: props.unitId! }),
  }
  const fn = MAP[props.entity]
  return fn
}

const getLimit = ({ plan, entity }: { plan: PlanSchemaT; entity: Entity }) => {
  const MAP: Record<Entity, number> = {
    UNIT: plan.maxUnits,
    PRODUCT: plan.maxProducts,
    CUSTOMER: plan.maxCustomers,
    INVOICE: plan.maxInvoices,
  }
  return MAP[entity]
}

const LimitReached = async ({
  count,
  limit,
  orgId,
  plan,
  unitId,
  ...props
}: {
  orgId: string
  count: number
  limit: number
  plan: PlanSchemaT
  entity: Entity
  unitId: string | null
}) => {
  const t = await getTranslations()

  const entity = {
    UNIT: t("unitsLimit"),
    PRODUCT: t("productsLimit"),
    CUSTOMER: t("customersLimit"),
    INVOICE: t("invoicesLimit"),
  }[props.entity]

  const href = {
    UNIT: `/o/${orgId}/unit/list/active`,
    PRODUCT: `/o/${orgId}/u/${unitId}/product/list/active`,
    CUSTOMER: `/o/${orgId}/u/${unitId}/customer/list/active`,
    INVOICE: `/o/${orgId}/u/${unitId}/invoice/list/today`,
  }[props.entity]

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <LockIcon className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-xl font-semibold">
            {t("Plan Limit Reached")}
          </CardTitle>
          <CardDescription>
            {t("You've reached your plan's limit for {entity}", {
              entity,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>{t("Current Usage")}</AlertTitle>
            <AlertDescription>
              {t(
                "You have {count} of {limit} {entity} allowed on your {planName} plan",
                {
                  count,
                  limit,
                  entity,
                  planName: plan.name,
                }
              )}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium">{t("What you can do:")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ArrowUpIcon className="mt-0.5 h-3 w-3 text-blue-500" />
                {t("Upgrade to a higher plan for more {entity}", {
                  entity,
                })}
              </li>
              <li className="flex items-start gap-2">
                <ArrowUpIcon className="mt-0.5 h-3 w-3 text-blue-500" />
                {t("Archive unused {entity} to free up space", {
                  entity,
                })}
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href={`/o/${orgId}/billing/subscription`}>
                <ArrowUpIcon className="mr-2 h-4 w-4" />
                {t("Upgrade Plan")}
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href={href}>
                {t("Manage {entity}", {
                  entity,
                })}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const NoSubscription = async ({ orgId }: { orgId: string }) => {
  const t = await getTranslations()

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <CreditCardIcon className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold">
            {t("No Active Subscription")}
          </CardTitle>
          <CardDescription>
            {t("You need an active subscription to access this feature")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>{t("Subscription Required")}</AlertTitle>
            <AlertDescription>
              {t("Please subscribe to a plan to start using our services")}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium">{t("Get started:")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ArrowUpIcon className="mt-0.5 h-3 w-3 text-blue-500" />
                {t("Choose a plan that fits your needs")}
              </li>
              <li className="flex items-start gap-2">
                <ArrowUpIcon className="mt-0.5 h-3 w-3 text-blue-500" />
                {t("Start with our free trial")}
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href={`/o/${orgId}/billing/subscription`}>
                <CreditCardIcon className="mr-2 h-4 w-4" />
                {t("Choose Plan")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const SubscriptionNotActive = async ({ orgId }: { orgId: string }) => {
  const t = await getTranslations()

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <XCircleIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="text-xl font-semibold">
            {t("Subscription Inactive")}
          </CardTitle>
          <CardDescription>
            {t("Your subscription is not currently active")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>{t("Access Restricted")}</AlertTitle>
            <AlertDescription>
              {t(
                "Please reactivate your subscription to continue using this feature"
              )}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium">{t("Possible reasons:")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ArrowUpIcon className="mt-0.5 h-3 w-3 text-blue-500" />
                {t("Payment issue or expired card")}
              </li>
              <li className="flex items-start gap-2">
                <ArrowUpIcon className="mt-0.5 h-3 w-3 text-blue-500" />
                {t("Subscription was cancelled or expired")}
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href={`/o/${orgId}/billing/subscription`}>
                <ArrowUpIcon className="mr-2 h-4 w-4" />
                {t("Reactivate Subscription")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const NoPlan = async ({ orgId }: { orgId: string }) => {
  const t = await getTranslations()

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <AlertTriangleIcon className="h-6 w-6 text-gray-600" />
          </div>
          <CardTitle className="text-xl font-semibold">
            {t("Plan Not Found")}
          </CardTitle>
          <CardDescription>
            {t("The subscription plan could not be found")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>{t("Configuration Error")}</AlertTitle>
            <AlertDescription>
              {t(
                "There seems to be an issue with your subscription plan configuration"
              )}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium">{t("What you can do:")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ArrowUpIcon className="mt-0.5 h-3 w-3 text-blue-500" />
                {t("Contact support for assistance")}
              </li>
              <li className="flex items-start gap-2">
                <ArrowUpIcon className="mt-0.5 h-3 w-3 text-blue-500" />
                {t("Try selecting a new plan")}
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href={`/o/${orgId}/billing/subscription`}>
                <CreditCardIcon className="mr-2 h-4 w-4" />
                {t("Manage Subscription")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const WithSubscription = async ({
  orgId,
  entity,
  unitId,
  children,
}: PropsWithChildren<Props>) => {
  const [subscription, plans, count] = await Promise.all([
    getSubscriptionByOrgId(orgId),
    getPlans(),
    getCountFn({ orgId, unitId, entity })(),
  ])

  if (!subscription) return <NoSubscription orgId={orgId} />

  if (subscription.status !== "ACTIVE")
    return <SubscriptionNotActive orgId={orgId} />

  const plan = plans.find((p) => p.id === subscription.plan)

  if (!plan) return <NoPlan orgId={orgId} />

  const limit = getLimit({ plan, entity })

  const isUnlimited = limit === -1 // -1 means unlimited
  const exceeds = count >= limit && !isUnlimited

  if (exceeds)
    return (
      <LimitReached
        count={count}
        limit={limit}
        orgId={orgId}
        plan={plan}
        entity={entity}
        unitId={unitId}
      />
    )

  return children
}

export { WithSubscription }
