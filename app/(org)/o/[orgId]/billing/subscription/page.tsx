import { getSubscriptionByOrgId } from "@/db/app/actions/subscription"
import { getTranslations } from "next-intl/server"
import { BillingPage } from "./billing-page"
import { NoSubscriptionPage } from "./no-subscription-page"

type Props = {
  params: Promise<GlobalParams>
}

const Page = async (props: Props) => {
  const t = await getTranslations()
  const { orgId } = await props.params

  const subscription = await getSubscriptionByOrgId(orgId)

  if (!subscription) {
    return <NoSubscriptionPage orgId={orgId} />
  }

  return <BillingPage subscription={subscription} />
}

export default Page
