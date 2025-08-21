import { SupplierForm } from "@/components/forms"
import { PageContent, PageFormHeader } from "@/components/layout"
import { WithSubscription } from "@/components/wrapper"
import { createSupplier } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { supplier } from "@/orm/app/schema"
import { SupplierFormProvider } from "@/providers"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<{ orgId: string; unitId: string; id: string }>
}

const Page = async (props: Props) => {
  const { orgId, unitId, id } = await props.params

  const data = await db.query.supplier.findFirst({
    where: eq(supplier.id, id),
  })

  return (
    <WithSubscription orgId={orgId} unitId={unitId} entity="SUPPLIER">
      <SupplierFormProvider defaultValues={data}>
        <PageFormHeader title="Duplicate supplier" formId="supplier" />
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
