import { FormActionBtns } from "@/components/buttons"
import { CashRegisterForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createCashRegister } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { cashRegister } from "@/orm/app/schema"
import { CashRegisterFormProvider } from "@/providers/cashRegister-form"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParams & { id: string }>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId, id } = await params

  const data = await db.query.cashRegister.findFirst({
    where: eq(cashRegister.id, id),
  })

  return (
    <CashRegisterFormProvider defaultValues={data}>
      <PageHeader
        title="Duplicate cash register"
        className="mb-2"
        rightComp={<FormActionBtns formId="cashRegister" />}
      />
      <CashRegisterForm
        performAction={async (values) => {
          "use server"
          await createCashRegister({ values, orgId, unitId })
        }}
      />
    </CashRegisterFormProvider>
  )
}

export default Page
