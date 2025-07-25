"use client"

/**
 * dont import from "actions" only since circular dependency issue will happen with the customer actions who use invoiceColumns
 */
import { InvoiceActions } from "@/components/actions/invoice"
//
import { SortBtn } from "@/components/buttons"
import { Badge } from "@/components/ui/badge"
import {
  DateFilter,
  NumberFilter,
  SelectFilter,
  StringFilter,
} from "@/components/ui/data-table"
import { mapPayMethodIcon } from "@/contants/maps"
import {
  CashRegisterSchemaT,
  InvoiceSchemaT,
  WarehouseSchemaT,
} from "@/db/app/schema"
import { formatDate, formatNumber } from "@/lib/utils"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

type SchemaT = InvoiceSchemaT & {
  warehouse: WarehouseSchemaT | null
  cashRegister: CashRegisterSchemaT | null
}

const PayMethodCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  const Icon = mapPayMethodIcon(original.payMethod)

  return (
    <Badge variant="secondary">
      <Icon className="mr-1" size={15} />
      {t(original.payMethod)}
    </Badge>
  )
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
    accessorKey: "warehouse.name",
    header: ({ column }) => (
      <div>
        <SortBtn text="Warehouse" column={column} />
        <SelectFilter title="Warehouse" column={column} isTranslated />
      </div>
    ),
    cell: ({ row }) => row.original.warehouse?.name || "-",
  },
  {
    accessorKey: "cashRegister.name",
    header: ({ column }) => (
      <div>
        <SortBtn text="Cash register" column={column} />
        <SelectFilter title="Cash register" column={column} isTranslated />
      </div>
    ),
    cell: ({ row }) => row.original.cashRegister?.name || "-",
  },
  {
    id: "actions",
    cell: InvoiceActions,
  },
]

export { columns as invoiceColumns }
