import { InvoiceConfigSchemaT } from "@/db/app/schema"
import { PayMethodT } from "@/types/enum"

const checkShouldTriggerCash = ({
  invoiceConfig,
  payMethod,
}: {
  invoiceConfig: InvoiceConfigSchemaT
  payMethod: PayMethodT
}) => invoiceConfig?.triggerCashOnInvoice && payMethod === "cash"

export { checkShouldTriggerCash }
