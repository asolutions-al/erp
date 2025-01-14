import { FormActionBtns } from "@/components/buttons"
import { ProductForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createProduct } from "@/db/(inv)/actions"
import { ProductFormProvider } from "@/providers/product-form"

type Props = {
  params: Promise<{ unitId: string }>
}

const Page = async ({ params }: Props) => {
  const { unitId } = await params

  return (
    <ProductFormProvider>
      <PageHeader
        title={"Create Product"}
        className="mb-2"
        renderRight={() => <FormActionBtns formId="product" />}
      />
      <ProductForm
        performAction={async (values) => {
          "use server"
          await createProduct({ values, unitId })
        }}
      />
    </ProductFormProvider>
  )
}

export default Page
