import { SupplierForm } from "@/components/forms"
import { PageContent, PageFormHeader } from "@/components/layout"
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
        <PageFormHeader title="Create supplier" formId="supplier" />
        <PageContent>
          <SupplierForm
            performAction={async (values) => {
              "use server"
              await createSupplier({ values, unitId, orgId })
            }}
          />
        </PageContent>
      </SupplierFormProvider>
    </WithSubscription>
  )
}

export default Page
