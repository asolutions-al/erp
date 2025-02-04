"use client"

import { InvoiceActions } from "@/components/actions"
import { SortBtn } from "@/components/buttons"
import { InvoiceSchemaT } from "@/db/app/schema"
import { formatDate } from "@/lib/utils"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

type SchemaT = InvoiceSchemaT

const PayMethodCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.payMethod)
}
const CurrencyCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.currency)
}
const StatusCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.status)
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
    cell: CurrencyCell,
  },
  {
    accessorKey: "payMethod",
    header: ({ column }) => <SortBtn text="Payment method" column={column} />,
    cell: PayMethodCell,
  },
  {
    accessorKey: "customer.name",
    header: ({ column }) => <SortBtn text="Customer name" column={column} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortBtn text="Status" column={column} />,
    cell: StatusCell,
  },
  {
    id: "actions",
    cell: InvoiceActions,
  },
]

export { columns as invoiceColumns }
