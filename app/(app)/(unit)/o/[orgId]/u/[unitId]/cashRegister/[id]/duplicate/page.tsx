import { CashRegisterForm } from "@/components/forms"
import { PageContent, PageFormHeader } from "@/components/layout"
import { createCashRegister } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { cashRegister } from "@/orm/app/schema"
import { CashRegisterFormProvider } from "@/providers"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParamsT & { id: string }>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId, id } = await params

  const data = await db.query.cashRegister.findFirst({
    where: eq(cashRegister.id, id),
  })

  return (
    <CashRegisterFormProvider defaultValues={data}>
      <PageFormHeader title="Duplicate cash register" formId="cashRegister" />
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
