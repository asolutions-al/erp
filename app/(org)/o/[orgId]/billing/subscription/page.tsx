import { getSubscriptionByOrgId } from "@/db/app/actions/subscription"
import { getPlans } from "@/db/auth/loaders"
import { cancelSubscription, createSubscription } from "@/services/subscription"
import { BillingPage } from "./billing-page"

type Props = {
  params: Promise<GlobalParams>
}

const Page = async (props: Props) => {
  const { orgId } = await props.params

  const subscription = await getSubscriptionByOrgId(orgId)
  const plans = await getPlans()

  if (!subscription) return null

  return (
    <BillingPage
      subscription={subscription}
      plans={plans}
      createSubscription={async (planId) => {
        "use server"
        const res = await createSubscription(orgId, planId)
        return res
      }}
      cancelSubscription={async () => {
        "use server"
        return await cancelSubscription(orgId)
      }}
    />
  )
}

export default Page
