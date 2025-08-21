import { CustomerForm } from "@/components/forms"
import { PageContent, PageFormHeader } from "@/components/layout"
import { WithSubscription } from "@/components/wrapper"
import { createCustomer } from "@/db/app/actions"
import { CustomerFormProvider } from "@/providers"

type Props = {
  params: Promise<{ unitId: string; orgId: string }>
}

const Page = async ({ params }: Props) => {
  const { unitId, orgId } = await params

  return (
    <WithSubscription orgId={orgId} unitId={unitId} entity="CUSTOMER">
      <CustomerFormProvider>
        <PageFormHeader title="Create customer" formId="customer" />
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
