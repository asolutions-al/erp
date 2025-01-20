"use client"

import { InvoiceSchemaT } from "@/db/(inv)/schema"
import { formatDate } from "@/lib/utils"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"
import { SortBtn } from "../buttons"

const PayMethodCell = ({ row }: CellContext<InvoiceSchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.payMethod)
}

const columns: ColumnDef<InvoiceSchemaT>[] = [
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
]

export { columns as invoiceColumns }
