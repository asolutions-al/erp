import { FormActionBtns } from "@/components/buttons"
import { ProductForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { WithSubscription } from "@/components/wrapper"
import { createProduct } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { category, warehouse } from "@/orm/app/schema"
import { ProductFormProvider } from "@/providers"
import { and, eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParamsT>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId } = await params

  const [warehouses, categories] = await Promise.all([
    db.query.warehouse.findMany({
      where: and(
        eq(warehouse.orgId, orgId),
        eq(warehouse.unitId, unitId),
        eq(warehouse.status, "active")
      ),
    }),
    db.query.category.findMany({
      where: and(
        eq(category.orgId, orgId),
        eq(category.unitId, unitId),
        eq(category.status, "active")
      ),
    }),
  ])

  return (
    <WithSubscription orgId={orgId} unitId={unitId} entity="PRODUCT">
      <ProductFormProvider>
        <PageHeader
          title={"Create product"}
          className="mb-2"
          rightComp={<FormActionBtns formId="product" />}
        />
        <ProductForm
          categories={categories}
          warehouses={warehouses}
          performAction={async (values) => {
            "use server"
            await createProduct({ values, orgId, unitId })
          }}
        />
      </ProductFormProvider>
    </WithSubscription>
  )
}

export default Page
