import { FormActionBtns } from "@/components/buttons"
import { InvoiceConfigForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { updateInvoiceConfig } from "@/db/app/actions/invoiceConfig"
import { db } from "@/db/app/instance"
import { invoiceConfig } from "@/orm/app/schema"
import { InvoiceConfigFormProvider } from "@/providers"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<{ orgId: string; unitId: string }>
}

const Page = async ({ params }: Props) => {
  const { unitId } = await params

  const config = await db.query.invoiceConfig.findFirst({
    where: eq(invoiceConfig.unitId, unitId),
  })

  return (
    <InvoiceConfigFormProvider defaultValues={config}>
      <PageHeader
        title="Invoice configuration"
        className="mb-2"
        rightComp={<FormActionBtns formId="invoiceConfig" />}
      />
      <InvoiceConfigForm
        performAction={async (values) => {
          "use server"

          if (!config) return // config is created when unit is created, so it should always exist

          await updateInvoiceConfig({ values, id: config?.id })
        }}
      />
    </InvoiceConfigFormProvider>
  )
}

export default Page
