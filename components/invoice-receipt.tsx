import { Separator } from "@/components/ui/separator"
import { InvoiceFormSchemaT } from "@/providers/invoice-form"

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
  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col sm:flex-row justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoice</h2>
          <p>Invoice Number: {invoiceData.invoiceNumber}</p>
          <p>Date: {invoiceData.date}</p>
          <p>Due Date: {invoiceData.dueDate}</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:text-right">
          <h3 className="font-semibold">Customer Details</h3>
          <p>{data.customerName}</p>
          <p>{invoiceData.customerEmail}</p>
        </div>
      </div>
      <div className="mb-6">
        <div className="grid grid-cols-5 font-semibold mb-2">
          <div className="col-span-2">Description</div>
          <div className="text-right">Quantity</div>
          <div className="text-right">Unit Price</div>
          <div className="text-right">Total</div>
        </div>
        <Separator className="mb-2" />
        {invoiceData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 mb-2">
            <div className="col-span-2">{item.description}</div>
            <div className="text-right">{item.quantity}</div>
            <div className="text-right">${item.unitPrice.toFixed(2)}</div>
            <div className="text-right">${item.total.toFixed(2)}</div>
          </div>
        ))}
        <Separator className="mt-2 mb-4" />
      </div>
      <div className="flex justify-end">
        <div className="w-full sm:w-1/2">
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>${invoiceData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax:</span>
            <span>${invoiceData.tax.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${invoiceData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { InvoiceReceipt }
