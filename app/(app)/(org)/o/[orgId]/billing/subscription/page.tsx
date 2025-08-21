import { AvailablePlansCard } from "@/components/billing"
import { CurrentPlanCard, PaymentInfoCard } from "@/components/cards"
import { PageContent, PageListHeader } from "@/components/layout"
import { getSubscriptionByOrgId } from "@/db/app/actions/subscription"
import { getPlans } from "@/db/auth/loaders"
import {
  cancelSubscription,
  createSubscription,
  switchToStarterPlan,
} from "@/services/subscription"

type Props = {
  params: Promise<GlobalParamsT>
}

const Page = async (props: Props) => {
  const { orgId } = await props.params

  const subscription = await getSubscriptionByOrgId(orgId)
  const plans = await getPlans()

  if (!subscription) return null

  const currentPlan =
    plans.find((plan) => plan.id === subscription.plan) || plans[0]

  return (
    <>
      <PageListHeader title="Subscription" />
      <PageContent>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <CurrentPlanCard
              subscription={subscription}
              currentPlan={currentPlan}
            />

            <PaymentInfoCard
              subscription={subscription}
              cancelSubscription={async () => {
                "use server"
                return await cancelSubscription(orgId)
              }}
            />
          </div>

          <AvailablePlansCard
            subscription={subscription}
            plans={plans}
            createSubscription={async (planId) => {
              "use server"
              const res = await createSubscription(orgId, planId)
              return res
            }}
            switchToStarterPlan={async () => {
              "use server"
              return await switchToStarterPlan(orgId)
            }}
          />
        </div>
      </PageContent>
    </>
  )
}

export default Page
