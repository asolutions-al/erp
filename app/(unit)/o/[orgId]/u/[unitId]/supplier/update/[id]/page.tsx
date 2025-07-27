import { FormActionBtns } from "@/components/buttons"
import { SupplierForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { updateSupplier } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { supplier } from "@/orm/app/schema"
import { SupplierFormProvider } from "@/providers"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<{ id: string }>
}

const Page = async (props: Props) => {
  const { id } = await props.params

  const data = await db.query.supplier.findFirst({
    where: eq(supplier.id, id),
  })

  return (
    <SupplierFormProvider defaultValues={data}>
      <PageHeader
        title="Update supplier"
        className="mb-2"
        rightComp={<FormActionBtns formId="supplier" />}
      />
      <SupplierForm
        performAction={async (values) => {
          "use server"
          await updateSupplier({ values, id })
        }}
      />
    </SupplierFormProvider>
  )
}

export default Page
