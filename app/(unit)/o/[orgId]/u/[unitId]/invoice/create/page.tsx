import { FormActionBtns } from "@/components/buttons"
import { InvoiceForm } from "@/components/forms"
import { InvoiceOptions } from "@/components/invoice-options"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { createInvoice } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import {
  cashRegister,
  customer,
  invoiceConfig,
  product,
  warehouse,
} from "@/orm/app/schema"
import { InvoiceFormProvider } from "@/providers"
import { and, eq } from "drizzle-orm"
import { Settings2Icon } from "lucide-react"
import { getTranslations } from "next-intl/server"

type Props = {
  params: Promise<{ orgId: string; unitId: string }>
}

const Page = async (props: Props) => {
  const { params } = props
  const t = await getTranslations()
  const { orgId, unitId } = await params
  const [products, customers, cashRegisters, warehouses, config] =
    await Promise.all([
      db.query.product.findMany({
        where: and(eq(product.unitId, unitId), eq(product.status, "active")),
      }),
      db.query.customer.findMany({
        where: and(eq(customer.unitId, unitId), eq(customer.status, "active")),
      }),
      db.query.cashRegister.findMany({
        where: and(
          eq(cashRegister.unitId, unitId),
          eq(cashRegister.status, "active"),
          eq(cashRegister.isOpen, true)
        ),
      }),
      db.query.warehouse.findMany({
        where: and(
          eq(warehouse.unitId, unitId),
          eq(warehouse.status, "active")
        ),
      }),
      db.query.invoiceConfig.findFirst({
        where: eq(invoiceConfig.unitId, unitId),
      }),
    ])

  return (
    <InvoiceFormProvider defaultValues={config}>
      <PageHeader
        title={"Create invoice"}
        className="mb-2 max-w-none"
        rightComp={
          <FormActionBtns formId="invoice">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  <Settings2Icon />
                  <span className="sr-only sm:not-sr-only">
                    {t("Additional options")}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className="mb-4">
                  <SheetTitle>{t("Invoice options")}</SheetTitle>
                  <SheetDescription>
                    {t("Configure additional invoice settings and preferences")}
                    .
                  </SheetDescription>
                </SheetHeader>
                <InvoiceOptions />
              </SheetContent>
            </Sheet>
          </FormActionBtns>
        }
      />
      <InvoiceForm
        products={products}
        customers={customers}
        cashRegisters={cashRegisters}
        warehouses={warehouses}
        invoiceConfig={config!}
        performAction={async (values) => {
          "use server"
          await createInvoice({ values, orgId, unitId })
        }}
      />
    </InvoiceFormProvider>
  )
}

export default Page
