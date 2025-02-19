import { FormActionBtns } from "@/components/buttons"
import { ProductForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createProduct } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { product, warehouse } from "@/orm/app/schema"
import { ProductFormProvider } from "@/providers/product-form"
import { and, eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParams & { id: string }>
}

const Page = async (props: Props) => {
  const { orgId, unitId, id } = await props.params

  const [data, warehouses] = await Promise.all([
    db.query.product.findFirst({
      where: eq(product.id, id),
    }),
    db.query.warehouse.findMany({
      where: and(eq(warehouse.orgId, orgId), eq(warehouse.unitId, unitId)),
    }),
  ])

  return (
    <ProductFormProvider defaultValues={data}>
      <PageHeader
        title={"Duplicate product"}
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
