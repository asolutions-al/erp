import { CustomerForm } from "@/components/forms"
import { PageContent, PageFormHeader } from "@/components/layout"
import { WithSubscription } from "@/components/wrapper"
import { createCustomer } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { customer } from "@/orm/app/schema"
import { CustomerFormProvider } from "@/providers"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<{ orgId: string; unitId: string; id: string }>
}

const Page = async (props: Props) => {
  const { orgId, unitId, id } = await props.params

  const data = await db.query.customer.findFirst({
    where: eq(customer.id, id),
  })

  return (
    <WithSubscription orgId={orgId} unitId={unitId} entity="CUSTOMER">
      <CustomerFormProvider defaultValues={data}>
        <PageFormHeader title="Duplicate customer" formId="customer" />
        <PageContent>
          <CustomerForm
            performAction={async (values) => {
              "use server"
              await createCustomer({ values, unitId, orgId })
            }}
          />
        </PageContent>
      </CustomerFormProvider>
    </WithSubscription>
  )
}

export default Page
