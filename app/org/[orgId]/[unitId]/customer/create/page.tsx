import { FormActionBtns } from "@/components/buttons"
import { CustomerForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createCustomer } from "@/db/app/actions"
import { CustomerFormProvider } from "@/providers/customer-form"

type Props = {
  params: Promise<{ unitId: string }>
}

const Page = async ({ params }: Props) => {
  const { unitId } = await params

  return (
    <CustomerFormProvider>
      <PageHeader
        title={"Create customer"}
        className="mb-2"
        renderRight={() => <FormActionBtns formId="customer" />}
      />
      <CustomerForm
        performAction={async (values) => {
          "use server"
          await createCustomer({ values, unitId })
        }}
      />
    </CustomerFormProvider>
  )
}

export default Page
