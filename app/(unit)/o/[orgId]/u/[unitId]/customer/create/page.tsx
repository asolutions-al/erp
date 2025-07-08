import { FormActionBtns } from "@/components/buttons"
import { CustomerForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
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
        <PageHeader
          title={"Create customer"}
          className="mb-2"
          rightComp={<FormActionBtns formId="customer" />}
        />
        <CustomerForm
          performAction={async (values) => {
            "use server"
            await createCustomer({ values, unitId, orgId })
          }}
        />
      </CustomerFormProvider>
    </WithSubscription>
  )
}

export default Page
