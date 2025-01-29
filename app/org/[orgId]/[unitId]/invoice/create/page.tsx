import { FormActionBtns } from "@/components/buttons"
import { InvoiceForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createInvoice } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { product } from "@/orm/app/schema"
import { InvoiceFormProvider } from "@/providers/invoice-form"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<{ orgId: string; unitId: string }>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId } = await params
  const [products, customers] = await Promise.all([
    db.query.product.findMany({
      where: eq(product.unitId, unitId),
    }),
    db.query.customer.findMany({
      where: eq(product.unitId, unitId),
    }),
  ])

  return (
    <InvoiceFormProvider>
      <PageHeader
        title={"Create invoice"}
        className="mb-2 max-w-none"
        renderRight={() => <FormActionBtns formId="invoice" />}
      />
      <InvoiceForm
        products={products}
        customers={customers}
        performAction={async (values) => {
          "use server"
          await createInvoice({ values, orgId, unitId })
        }}
      />
    </InvoiceFormProvider>
  )
}

export default Page
