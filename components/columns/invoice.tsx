"use client"

/**
 * dont import from "actions" only since circular dependency issue will happen with the customer actions who use invoiceColumns
 */
import { InvoiceActions } from "@/components/actions/invoice"
//
import { SortBtn } from "@/components/buttons"
import {
  DateFilter,
  NumberFilter,
  SelectFilter,
  StringFilter,
} from "@/components/ui/data-table"
import { InvoiceSchemaT } from "@/db/app/schema"
import { formatDate, formatNumber } from "@/lib/utils"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

type SchemaT = InvoiceSchemaT

const PayMethodCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.payMethod)
}

const StatusCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.status)
}

const columns: ColumnDef<SchemaT>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div>
        <SortBtn text="Date" column={column} />
        <DateFilter title="Date" column={column} />
      </div>
    ),
    cell: ({ row }) => formatDate(new Date(row.original.createdAt)),
    filterFn: "dateRangeFilter",
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <div>
        <SortBtn text="Total" column={column} />
        <NumberFilter title="Total" column={column} />
      </div>
    ),
    cell: ({ row }) => formatNumber(row.original.total),
    filterFn: "numberRangeFilter",
  },
  {
    accessorKey: "payMethod",
    header: ({ column }) => (
      <div>
        <SortBtn text="Payment method" column={column} />
        <SelectFilter title="Payment method" column={column} />
      </div>
    ),
    cell: PayMethodCell,
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <div>
        <SortBtn text="Customer name" column={column} />
        <StringFilter title="Customer" column={column} />
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div>
        <SortBtn text="Status" column={column} />
        <SelectFilter title="Status" column={column} />
      </div>
    ),
    cell: StatusCell,
    filterFn: "equals",
  },
  {
    id: "actions",
    cell: InvoiceActions,
  },
]

export { columns as invoiceColumns }
