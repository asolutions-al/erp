import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import { InvoiceFormSchemaT } from "@/providers/invoice-form"
import { calcInvoiceForm, calcInvoiceFormRow } from "@/utils/calc"
import { useTranslations } from "next-intl"
import Image from "next/image"

type Props = {
  data: InvoiceFormSchemaT
}

const InvoiceReceipt = ({ data }: Props) => {
  const t = useTranslations()
  const calcs = calcInvoiceForm(data)
  return (
    <div>
      <div className="mb-8 flex flex-col justify-between sm:flex-row">
        <div>
          <h2 className="text-2xl font-bold">{t("Invoice")}</h2>
          <p>
            {t("Invoice number")}: {0}
          </p>
          <p>
            {t("Date")}: {formatDate(new Date())}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:text-right">
          <h3 className="font-semibold">{t("Customer details")}</h3>
          <p>{data.customer?.name}</p>
          <p>{data.customer?.idValue}</p>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-6 font-semibold">
          <div className="col-span-2">{t("Name")}</div>
          <div className="text-right">{t("Quantity")}</div>
          <div className="text-right">{t("Price")}</div>
          <div className="text-right">{t("Tax")}</div>
          <div className="text-right">{t("Total")}</div>
        </div>
        <Separator className="my-2" />
        {data.rows.map((row, index) => {
          const calc = calcInvoiceFormRow(row)
          return (
            <div key={index} className="grid grid-cols-6">
              <div className="col-span-2">{row.name}</div>
              <div className="text-right">{row.quantity}</div>
              <div className="text-right">{row.price}</div>
              <div className="text-right">{calc.tax}</div>
              <div className="text-right">{calcInvoiceFormRow(row).total}</div>
            </div>
          )
        })}
        <Separator className="my-2" />
      </div>
      <div className="mb-6 flex justify-end">
        <div className="w-full sm:w-1/2">
          <div className="mb-2 flex justify-between">
            <span>{t("Subtotal")}:</span>
            <span>{calcs.subtotal}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span>{t("Tax")}:</span>
            <span>{calcs.tax}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span>{t("Discount")}:</span>
            <span>{calcs.discount}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>{t("Total")}:</span>
            <span>{calcs.total}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Image
          src="/logo.png"
          width={40}
          height={40}
          alt={t("Invoice footer")}
        />
      </div>
    </div>
  )
}

export { InvoiceReceipt }
