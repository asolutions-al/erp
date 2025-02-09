import { FormActionBtns } from "@/components/buttons"
import { CustomerForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createCustomer } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { customer } from "@/orm/app/schema"
import { CustomerFormProvider } from "@/providers/customer-form"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<{ orgId: string; unitId: string; id: string }>
}

const Page = async (props: Props) => {
  const { orgId, unitId, id } = await props.params

  const data = await db.query.customer.findFirst({
    where: eq(customer.id, id),
  })

  return (
    <CustomerFormProvider defaultValues={data}>
      <PageHeader
        title={"Duplicate customer"}
        className="mb-2"
        rightComp={<FormActionBtns formId="customer" />}
      />
      <CustomerForm
        performAction={async (values) => {
          "use server"
          await createCustomer({ values, unitId, orgId })
        }}
      />
    </CustomerFormProvider>
  )
}

export default Page
