import { FormActionBtns } from "@/components/buttons"
import { WarehouseForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createWarehouse } from "@/db/app/actions"
import { WarehouseFormProvider } from "@/providers/warehouse-form"

type Props = {
  params: Promise<{ orgId: string; unitId: string }>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId } = await params

  return (
    <WarehouseFormProvider>
      <PageHeader
        title="Create warehouse"
        className="mb-2"
        rightComp={<FormActionBtns formId="warehouse" />}
      />
      <WarehouseForm
        performAction={async (values) => {
          "use server"
          await createWarehouse({ values, orgId, unitId })
        }}
      />
    </WarehouseFormProvider>
  )
}

export default Page
