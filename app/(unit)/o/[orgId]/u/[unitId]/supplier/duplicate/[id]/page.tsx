import { FormActionBtns } from "@/components/buttons"
import { SupplierForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
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
    <WithSubscription orgId={orgId} unitId={unitId} entity="CUSTOMER">
      <SupplierFormProvider defaultValues={data}>
        <PageHeader
          title="Duplicate supplier"
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
