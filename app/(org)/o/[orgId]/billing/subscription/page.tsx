import { getSubscriptionByOrgId } from "@/db/app/actions/subscription"
import { getPlans } from "@/db/auth/loaders"
import { getTranslations } from "next-intl/server"
import { BillingPage } from "./billing-page"

type Props = {
  params: Promise<GlobalParams>
}

const Page = async (props: Props) => {
  const t = await getTranslations()
  const { orgId } = await props.params

  const subscription = await getSubscriptionByOrgId(orgId)
  const plans = await getPlans()
  console.log("Plans:", plans)

  if (!subscription) return null

  return <BillingPage subscription={subscription} plans={plans} />
}

export default Page
