import { FormActionBtns } from "@/components/buttons"
import { CustomerForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { updateCustomer } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { customer } from "@/orm/app/schema"
import { CustomerFormProvider } from "@/providers"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<{ id: string }>
}

const Page = async (props: Props) => {
  const { id } = await props.params

  const data = await db.query.customer.findFirst({
    where: eq(customer.id, id),
  })

  return (
    <CustomerFormProvider defaultValues={data}>
      <PageHeader
        title={"Update customer"}
        className="mb-2"
        rightComp={<FormActionBtns formId="customer" />}
      />
      <CustomerForm
        performAction={async (values) => {
          "use server"
          await updateCustomer({ values, id })
        }}
      />
    </CustomerFormProvider>
  )
}

export default Page
