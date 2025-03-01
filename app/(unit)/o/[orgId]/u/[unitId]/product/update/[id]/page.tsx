import { FormActionBtns } from "@/components/buttons"
import { ProductForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { updateProduct } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import {
  category,
  product,
  productCategory,
  productInventory,
  warehouse,
} from "@/orm/app/schema"
import { ProductFormProvider } from "@/providers"
import { and, eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParams & { id: string }>
}

const Page = async (props: Props) => {
  const { id, orgId, unitId } = await props.params

  const [data, warehouses, inventoryRows, categories, categoryRows] =
    await Promise.all([
      db.query.product.findFirst({
        where: eq(product.id, id),
      }),
      db.query.warehouse.findMany({
        where: and(
          eq(warehouse.orgId, orgId),
          eq(warehouse.unitId, unitId),
          eq(warehouse.status, "active")
        ),
      }),
      db.query.productInventory.findMany({
        where: eq(productInventory.productId, id),
      }),
      db.query.category.findMany({
        where: and(
          eq(category.orgId, orgId),
          eq(category.unitId, unitId),
          eq(category.status, "active")
        ),
      }),
      db.query.productCategory.findMany({
        where: eq(productCategory.productId, id),
      }),
    ])

  return (
    <ProductFormProvider
      defaultValues={{
        ...data,
        inventoryRows,
        categoryRows,
      }}
    >
      <PageHeader
        title={"Update product"}
        className="mb-2"
        rightComp={<FormActionBtns formId="product" />}
      />
      <ProductForm
        categories={categories}
        warehouses={warehouses}
        performAction={async (values) => {
          "use server"
          await updateProduct({ values, id, orgId, unitId })
        }}
      />
    </ProductFormProvider>
  )
}

export default Page
