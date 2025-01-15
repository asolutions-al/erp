import { FormActionBtns } from "@/components/buttons"
import { InvoiceForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { db } from "@/db/(inv)/instance"
import { product } from "@/orm/(inv)/schema"
import { ProductFormProvider } from "@/providers/product-form"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<{ unitId: string }>
}

const Page = async ({ params }: Props) => {
  const { unitId } = await params
  const products = await db.query.product.findMany({
    where: eq(product.unitId, unitId),
  })

  return (
    <ProductFormProvider>
      <PageHeader
        title={"Create invoice"}
        className="mb-2 max-w-none"
        renderRight={() => <FormActionBtns formId="invoice" />}
      />
      <InvoiceForm
        products={products}
        performAction={async (values) => {
          "use server"
          console.log("values", values)
        }}
      />
    </ProductFormProvider>
  )
}

export default Page
