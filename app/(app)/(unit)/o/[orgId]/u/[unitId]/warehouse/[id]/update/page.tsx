import { WarehouseForm } from "@/components/forms"
import { PageContent, PageFormHeader } from "@/components/layout"
import { updateWarehouse } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { warehouse } from "@/orm/app/schema"
import { WarehouseFormProvider } from "@/providers"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParamsT & { id: string }>
}

const Page = async ({ params }: Props) => {
  const { id } = await params

  const data = await db.query.warehouse.findFirst({
    where: eq(warehouse.id, id),
  })

  return (
    <WarehouseFormProvider defaultValues={data}>
      <PageFormHeader title="Update warehouse" formId="warehouse" />
      <PageContent>
        <WarehouseForm
          performAction={async (values) => {
            "use server"
            await updateWarehouse({ values, id })
          }}
        />
      </PageContent>
    </WarehouseFormProvider>
  )
}

export default Page
