"use client"

import { SortBtn } from "@/components/buttons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getInvoiceRows } from "@/db/app/loaders"
import { InvoiceRowSchemaT, InvoiceSchemaT } from "@/db/app/schema"
import { formatDate } from "@/lib/utils"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import {
  DownloadIcon,
  EyeIcon,
  MoreHorizontalIcon,
  PrinterIcon,
  Share2Icon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { InvoiceReceipt } from "../invoice-receipt"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { DropdownMenu } from "../ui/dropdown-menu"
import { ScrollArea } from "../ui/scroll-area"

type SchemaT = InvoiceSchemaT

const PayMethodCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.payMethod)
}

const Actions = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  const [rows, setRows] = useState<InvoiceRowSchemaT[]>([])

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DialogTrigger
            asChild
            onClick={async () => {
              try {
                const data = await getInvoiceRows({ invoiceId: original.id })
                setRows(data)
              } catch (error) {
                console.error(error)
                toast.error(t("Failed to load invoice rows"))
              }
            }}
          >
            <DropdownMenuItem>
              <EyeIcon />
              {t("View receipt")}
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-[625px] print:border-none print:shadow-none print:[&>button]:hidden">
        <DialogHeader className="print:hidden">
          <DialogTitle>{t("Invoice receipt")}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(80vh-120px)] overflow-auto">
          <InvoiceReceipt data={{ ...original, rows }} />
        </ScrollArea>
        <DialogFooter className="sm:justify-between print:hidden">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              variant="outline"
              onClick={() => {}}
              className="mt-2 w-full sm:mt-0 sm:w-auto"
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              {t("Pdf")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {}}
              className="w-full sm:w-auto"
            >
              <Share2Icon className="mr-2 h-4 w-4" />
              {t("Share")}
            </Button>
          </div>
          <Button onClick={() => {}} className="w-full sm:w-auto">
            <PrinterIcon className="mr-2 h-4 w-4" />
            {t("Print")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const columns: ColumnDef<SchemaT>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortBtn text="Date" column={column} />,
    cell: ({ row }) => formatDate(new Date(row.original.createdAt)),
  },
  {
    accessorKey: "total",
    header: ({ column }) => <SortBtn text="Total" column={column} />,
  },
  {
    accessorKey: "currency",
    header: ({ column }) => <SortBtn text="Currency" column={column} />,
  },
  {
    accessorKey: "payMethod",
    header: ({ column }) => <SortBtn text="Payment method" column={column} />,
    cell: PayMethodCell,
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => <SortBtn text="Customer name" column={column} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortBtn text="Status" column={column} />,
  },
  {
    id: "actions",
    cell: Actions,
  },
]

export { columns as invoiceColumns }
