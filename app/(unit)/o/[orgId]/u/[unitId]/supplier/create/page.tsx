import { FormActionBtns } from "@/components/buttons"
import { SupplierForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { WithSubscription } from "@/components/wrapper"
import { createSupplier } from "@/db/app/actions"
import { SupplierFormProvider } from "@/providers"

type Props = {
  params: Promise<{ unitId: string; orgId: string }>
}

const Page = async ({ params }: Props) => {
  const { unitId, orgId } = await params

  return (
    <WithSubscription orgId={orgId} unitId={unitId} entity="SUPPLIER">
      <SupplierFormProvider>
        <PageHeader
          title="Create supplier"
          className="mb-2"
          rightComp={<FormActionBtns formId="supplier" />}
        />
        <SupplierForm
          performAction={async (values) => {
            "use server"
            await createSupplier({ values, unitId, orgId })
          }}
        />
      </SupplierFormProvider>
    </WithSubscription>
  )
}

export default Page
