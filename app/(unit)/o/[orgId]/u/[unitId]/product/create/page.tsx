import { FormActionBtns } from "@/components/buttons"
import { ProductForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createProduct } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { warehouse } from "@/orm/app/schema"
import { ProductFormProvider } from "@/providers/product-form"
import { and, eq } from "drizzle-orm"

type Props = {
  params: Promise<{ orgId: string; unitId: string }>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId } = await params

  const warehouses = await db.query.warehouse.findMany({
    where: and(
      eq(warehouse.orgId, orgId),
      eq(warehouse.unitId, unitId),
      eq(warehouse.status, "active")
    ),
  })

  return (
    <ProductFormProvider>
      <PageHeader
        title={"Create product"}
        className="mb-2"
        rightComp={<FormActionBtns formId="product" />}
      />
      <ProductForm
        warehouses={warehouses}
        performAction={async (values) => {
          "use server"
          await createProduct({ values, orgId, unitId })
        }}
      />
    </ProductFormProvider>
  )
}

export default Page
