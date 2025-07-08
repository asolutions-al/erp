import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getSubscriptionByOrgId } from "@/db/app/actions"
import { getProductCount, getUnitCount } from "@/db/app/loaders"
import { getPlans } from "@/db/auth/loaders"
import { PlanSchemaT } from "@/db/auth/schema"
import { AlertTriangleIcon, ArrowUpIcon, LockIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { PropsWithChildren } from "react"

type Entity = "UNIT" | "PRODUCT"

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
  }
  const fn = MAP[props.entity]
  return fn
}

const getLimit = ({ plan, entity }: { plan: PlanSchemaT; entity: Entity }) => {
  const MAP: Record<Entity, number> = {
    UNIT: plan.maxUnits,
    PRODUCT: plan.maxProducts,
  }
  return MAP[entity]
}

const LimitReached = async ({
  count,
  limit,
  orgId,
  plan,
  ...props
}: {
  orgId: string
  count: number
  limit: number
  plan: PlanSchemaT
  entity: Entity
}) => {
  const t = await getTranslations()
  const entity = {
    UNIT: t("unitsLimit"),
    PRODUCT: t("productsLimit"),
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
              <Link href={`/o/${orgId}/units/list/active`}>
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

const WithSubscription = async ({
  orgId,
  entity,
  unitId = null,
  children,
}: PropsWithChildren<Props>) => {
  const [subscription, plans, count] = await Promise.all([
    getSubscriptionByOrgId(orgId),
    getPlans(),
    getCountFn({ orgId, unitId, entity })(),
  ])

  if (!subscription) return null

  if (subscription.status !== "ACTIVE") return null

  const plan = plans.find((p) => p.id === subscription.plan)

  if (!plan) return null

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
      />
    )

  return children
}

export { WithSubscription }
