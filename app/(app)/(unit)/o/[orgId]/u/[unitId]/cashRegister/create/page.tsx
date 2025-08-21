import { CashRegisterForm } from "@/components/forms"
import { PageContent, PageFormHeader } from "@/components/layout"
import { createCashRegister } from "@/db/app/actions"
import { CashRegisterFormProvider } from "@/providers"

type Props = {
  params: Promise<GlobalParamsT>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId } = await params

  return (
    <CashRegisterFormProvider>
      <PageFormHeader title="Create cash register" formId="cashRegister" />
      <PageContent>
        <CashRegisterForm
          performAction={async (values) => {
            "use server"
            await createCashRegister({ values, orgId, unitId })
          }}
        />
      </PageContent>
    </CashRegisterFormProvider>
  )
}

export default Page
