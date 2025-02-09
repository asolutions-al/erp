import { FormActionBtns } from "@/components/buttons"
import { CashRegisterForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createCashRegister } from "@/db/app/actions"
import { CashRegisterFormProvider } from "@/providers/cashRegister-form"

type Props = {
  params: Promise<{ orgId: string; unitId: string }>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId } = await params

  return (
    <CashRegisterFormProvider>
      <PageHeader
        title="Create cash register"
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
