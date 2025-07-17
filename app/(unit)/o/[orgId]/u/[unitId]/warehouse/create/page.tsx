import { FormActionBtns } from "@/components/buttons"
import { WarehouseForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createWarehouse } from "@/db/app/actions"
import { WarehouseFormProvider } from "@/providers"

type Props = {
  params: Promise<GlobalParamsT>
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
