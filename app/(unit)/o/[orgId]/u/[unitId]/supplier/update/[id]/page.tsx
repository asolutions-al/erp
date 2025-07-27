import { SupplierForm } from "@/components/forms"
import { PageContent, PageFormHeader } from "@/components/layout"
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
      <PageFormHeader title="Update supplier" formId="supplier" />
      <PageContent>
        <SupplierForm
          performAction={async (values) => {
            "use server"
            await updateSupplier({ values, id })
          }}
        />
      </PageContent>
    </SupplierFormProvider>
  )
}

export default Page
