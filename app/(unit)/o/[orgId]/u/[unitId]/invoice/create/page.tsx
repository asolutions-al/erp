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
import { customer, product } from "@/orm/app/schema"
import { InvoiceFormProvider } from "@/providers/invoice-form"
import { eq } from "drizzle-orm"
import { Settings2Icon } from "lucide-react"
import { getTranslations } from "next-intl/server"

type Props = {
  params: Promise<{ orgId: string; unitId: string }>
}

const Page = async ({ params }: Props) => {
  const t = await getTranslations()
  const { orgId, unitId } = await params
  const [products, customers] = await Promise.all([
    db.query.product.findMany({
      where: eq(product.unitId, unitId),
    }),
    db.query.customer.findMany({
      where: eq(customer.unitId, unitId),
    }),
  ])

  return (
    <InvoiceFormProvider>
      <PageHeader
        title={"Create invoice"}
        className="mb-2 max-w-none"
        renderRight={() => (
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
        )}
      />
      <InvoiceForm
        products={products}
        customers={customers}
        performAction={async (values) => {
          "use server"
          await createInvoice({ values, orgId, unitId })
        }}
      />
    </InvoiceFormProvider>
  )
}

export default Page
