import { FormActionBtns } from "@/components/buttons"
import { InvoiceConfigForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { updateInvoiceConfig } from "@/db/app/actions/invoiceConfig"
import { db } from "@/db/app/instance"
import { customer, invoiceConfig } from "@/orm/app/schema"
import { InvoiceConfigFormProvider } from "@/providers/invoice-config-form"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<{ orgId: string; unitId: string }>
}

const Page = async ({ params }: Props) => {
  const { unitId } = await params

  const [customers, config] = await Promise.all([
    db.query.customer.findMany({
      where: eq(customer.unitId, unitId),
    }),
    db.query.invoiceConfig.findFirst({
      where: eq(invoiceConfig.unitId, unitId),
    }),
  ])

  return (
    <InvoiceConfigFormProvider defaultValues={config}>
      <PageHeader
        title="Invoice configuration"
        className="mb-2"
        renderRight={() => <FormActionBtns formId="invoiceConfig" />}
      />
      <InvoiceConfigForm
        customers={customers}
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
