import { Separator } from "@/components/ui/separator"
import { InvoiceFormSchemaT } from "@/providers/invoice-form"
import { calcInvoiceFormRowTotal, calcInvoiceFormTotal } from "@/utils/calc"
import { useTranslations } from "next-intl"

type Props = {
  data: InvoiceFormSchemaT
}

// Dummy data for the invoice
const invoiceData = {
  invoiceNumber: "INV-2023-001",
  date: "2023-05-15",
  dueDate: "2023-06-14",
  customerName: "John Doe",
  customerEmail: "john.doe@example.com",
  items: [
    {
      description: "Web Development Services",
      quantity: 1,
      unitPrice: 1000,
      total: 1000,
    },
    { description: "UI/UX Design", quantity: 2, unitPrice: 500, total: 1000 },
    {
      description: "Content Creation",
      quantity: 5,
      unitPrice: 100,
      total: 500,
    },
  ],
  subtotal: 2500,
  tax: 250,
  total: 2750,
}

const InvoiceReceipt = ({ data }: Props) => {
  const t = useTranslations()
  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col justify-between sm:flex-row">
        <div>
          <h2 className="text-2xl font-bold">{t("Invoice")}</h2>
          <p>
            {t("Invoice number")}: {invoiceData.invoiceNumber}
          </p>
          <p>
            {t("Date")}: {invoiceData.date}
          </p>
          <p>
            {t("Currency")}: {t(data.currency)}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:text-right">
          <h3 className="font-semibold">{t("Customer details")}</h3>
          <p>{data.customerName}</p>
          <p>{invoiceData.customerEmail}</p>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-5 font-semibold">
          <div className="col-span-2">{t("Name")}</div>
          <div className="text-right">{t("Quantity")}</div>
          <div className="text-right">{t("Unit price")}</div>
          <div className="text-right">{t("Total")}</div>
        </div>
        <Separator className="my-2" />
        {data.rows.map((row, index) => (
          <div key={index} className="grid grid-cols-5">
            <div className="col-span-2">{row.name}</div>
            <div className="text-right">{row.quantity}</div>
            <div className="text-right">{row.unitPrice}</div>
            <div className="text-right">{calcInvoiceFormRowTotal(row)}</div>
          </div>
        ))}
        <Separator className="my-2" />
      </div>
      <div className="flex justify-end">
        <div className="w-full sm:w-1/2">
          <div className="mb-2 flex justify-between">
            <span>{t("Subtotal")}:</span>
            <span>{invoiceData.subtotal}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span>{t("Tax")}:</span>
            <span>{invoiceData.tax}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>{t("Total")}:</span>
            <span>{calcInvoiceFormTotal(data)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { InvoiceReceipt }
