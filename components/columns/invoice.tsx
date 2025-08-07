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
import { EM_DASH } from "@/constants/consts"
import { mapPayMethodIcon } from "@/constants/maps"
import {
  CashRegisterSchemaT,
  InvoiceSchemaT,
  UserSchemaT,
  WarehouseSchemaT,
} from "@/db/app/schema"
import { formatDate, formatNumber } from "@/lib/utils"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

type SchemaT = InvoiceSchemaT & {
  warehouse: WarehouseSchemaT | null
  cashRegister: CashRegisterSchemaT | null
  user_createdBy: UserSchemaT | null
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
    filterFn: "dateRange",
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
    filterFn: "numberRange",
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
    cell: ({ row }) => row.original.warehouse?.name || EM_DASH,
  },
  {
    accessorKey: "cashRegister.name",
    header: ({ column }) => (
      <div>
        <SortBtn text="Cash register" column={column} />
        <SelectFilter title="Cash register" column={column} isTranslated />
      </div>
    ),
    cell: ({ row }) => row.original.cashRegister?.name || EM_DASH,
  },
  {
    accessorKey: "user_createdBy.displayName",
    header: ({ column }) => (
      <div>
        <SortBtn text="Created by" column={column} />
        <StringFilter title="Created by" column={column} />
      </div>
    ),
    cell: ({ row }) => row.original.user_createdBy?.displayName || EM_DASH,
  },
  {
    id: "actions",
    cell: InvoiceActions,
  },
]

export { columns as invoiceColumns }
