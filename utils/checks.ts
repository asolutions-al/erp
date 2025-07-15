import { InvoiceConfigSchemaT } from "@/db/app/schema"
import { PayMethodT } from "@/types/enum"

const checkShouldTriggerCash = ({
  invoiceConfig,
  payMethod,
}: {
  invoiceConfig: Pick<InvoiceConfigSchemaT, "triggerCashOnInvoice">
  payMethod: PayMethodT
}) => invoiceConfig?.triggerCashOnInvoice && payMethod === "cash"

const checkShouldTriggerInventory = ({
  invoiceConfig,
}: {
  invoiceConfig: Pick<InvoiceConfigSchemaT, "triggerInventoryOnInvoice">
}) => invoiceConfig?.triggerInventoryOnInvoice

export { checkShouldTriggerCash, checkShouldTriggerInventory }
