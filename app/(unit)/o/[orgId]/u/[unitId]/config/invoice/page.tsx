import { FormActionBtns } from "@/components/buttons"
import { InvoiceConfigForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { updateInvoiceConfig } from "@/db/app/actions/invoiceConfig"
import { db } from "@/db/app/instance"
import {
  cashRegister,
  customer,
  invoiceConfig,
  warehouse,
} from "@/orm/app/schema"
import { InvoiceConfigFormProvider } from "@/providers"
import { and, eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParamsT>
}

const Page = async ({ params }: Props) => {
  const { unitId } = await params

  const [config, customers, warehouses, cashRegisters] = await Promise.all([
    db.query.invoiceConfig.findFirst({
      where: eq(invoiceConfig.unitId, unitId),
    }),
    db.query.customer.findMany({
      where: and(eq(customer.unitId, unitId), eq(customer.status, "active")),
    }),
    db.query.warehouse.findMany({
      where: and(eq(warehouse.unitId, unitId), eq(warehouse.status, "active")),
    }),
    db.query.cashRegister.findMany({
      where: and(
        eq(cashRegister.unitId, unitId),
        eq(cashRegister.status, "active")
      ),
    }),
  ])

  return (
    <InvoiceConfigFormProvider defaultValues={config}>
      <PageHeader
        title="Invoice configuration"
        className="mb-2"
        rightComp={<FormActionBtns formId="invoiceConfig" />}
      />
      <InvoiceConfigForm
        cashRegisters={cashRegisters}
        customers={customers}
        warehouses={warehouses}
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
