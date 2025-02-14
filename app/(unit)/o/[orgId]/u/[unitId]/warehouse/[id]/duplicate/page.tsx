import { FormActionBtns } from "@/components/buttons"
import { WarehouseForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createWarehouse } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { warehouse } from "@/orm/app/schema"
import { WarehouseFormProvider } from "@/providers/warehouse-form"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParams & { id: string }>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId, id } = await params

  const data = await db.query.warehouse.findFirst({
    where: eq(warehouse.id, id),
  })

  return (
    <WarehouseFormProvider defaultValues={data}>
      <PageHeader
        title="Duplicate warehouse"
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
