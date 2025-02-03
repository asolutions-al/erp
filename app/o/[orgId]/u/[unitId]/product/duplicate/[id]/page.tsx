import { FormActionBtns } from "@/components/buttons"
import { ProductForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createProduct } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { product } from "@/orm/app/schema"
import { ProductFormProvider } from "@/providers/product-form"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<{ unitId: string; id: string; orgId: string }>
}

const Page = async (props: Props) => {
  const { orgId, unitId, id } = await props.params

  const data = await db.query.product.findFirst({
    where: eq(product.id, id),
  })

  return (
    <ProductFormProvider defaultValues={data}>
      <PageHeader
        title={"Duplicate product"}
        className="mb-2"
        renderRight={() => <FormActionBtns formId="product" />}
      />
      <ProductForm
        performAction={async (values) => {
          "use server"
          await createProduct({ values, orgId, unitId })
        }}
      />
    </ProductFormProvider>
  )
}

export default Page
