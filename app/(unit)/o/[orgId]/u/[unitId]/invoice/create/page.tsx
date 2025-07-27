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
import { WithSubscription } from "@/components/wrapper"
import { createInvoice } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { createAuthClient } from "@/db/auth/client"
import {
  cashRegister,
  customer,
  invoiceConfig,
  product,
  productInventory,
  warehouse,
} from "@/orm/app/schema"
import { InvoiceFormProvider } from "@/providers"
import { and, eq } from "drizzle-orm"
import { Settings2Icon } from "lucide-react"
import { getTranslations } from "next-intl/server"

type Props = {
  params: Promise<GlobalParamsT>
}

const Page = async (props: Props) => {
  const { params } = props
  const t = await getTranslations()
  const authClient = await createAuthClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()
  const userId = user!.id
  const { orgId, unitId } = await params

  const [
    products,
    customers,
    cashRegisters,
    warehouses,
    config,
    productInventories,
  ] = await Promise.all([
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
      where: and(eq(warehouse.unitId, unitId), eq(warehouse.status, "active")),
    }),
    db.query.invoiceConfig.findFirst({
      where: eq(invoiceConfig.unitId, unitId),
    }),
    db.query.productInventory.findMany({
      where: and(
        eq(productInventory.orgId, orgId),
        eq(productInventory.unitId, unitId)
      ),
    }),
  ])

  return (
    <WithSubscription orgId={orgId} unitId={unitId} entity="INVOICE">
      <InvoiceFormProvider
        defaultValues={{
          ...config,
          // form does not accept null values
          customerId: config?.customerId || undefined,
          payMethod: config?.payMethod || undefined,
        }}
        config={config!}
        productInventories={productInventories}
      >
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
                      {t(
                        "Configure additional invoice settings and preferences"
                      )}
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
            await createInvoice({ values, orgId, unitId, userId })
          }}
        />
      </InvoiceFormProvider>
    </WithSubscription>
  )
}

export default Page
