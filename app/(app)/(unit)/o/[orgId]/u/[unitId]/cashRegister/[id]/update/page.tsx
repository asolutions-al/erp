import { CashRegisterForm } from "@/components/forms"
import { PageContent, PageFormHeader } from "@/components/layout"
import { updateCashRegister } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { cashRegister } from "@/orm/app/schema"
import { CashRegisterFormProvider } from "@/providers"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParamsT & { id: string }>
}

const Page = async ({ params }: Props) => {
  const { id } = await params

  const data = await db.query.cashRegister.findFirst({
    where: eq(cashRegister.id, id),
  })

  return (
    <CashRegisterFormProvider defaultValues={data}>
      <PageFormHeader title="Update cash register" formId="cashRegister" />
      <PageContent>
        <CashRegisterForm
          isUpdate
          performAction={async (values) => {
            "use server"
            await updateCashRegister({ values, id })
          }}
        />
      </PageContent>
    </CashRegisterFormProvider>
  )
}

export default Page
