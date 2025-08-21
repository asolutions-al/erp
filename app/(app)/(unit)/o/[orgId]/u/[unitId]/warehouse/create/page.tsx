import { WarehouseForm } from "@/components/forms"
import { PageContent, PageFormHeader } from "@/components/layout"
import { createWarehouse } from "@/db/app/actions"
import { WarehouseFormProvider } from "@/providers"

type Props = {
  params: Promise<GlobalParamsT>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId } = await params

  return (
    <WarehouseFormProvider>
      <PageFormHeader title="Create warehouse" formId="warehouse" />
      <PageContent>
        <WarehouseForm
          performAction={async (values) => {
            "use server"
            await createWarehouse({ values, orgId, unitId })
          }}
        />
      </PageContent>
    </WarehouseFormProvider>
  )
}

export default Page
