"use client"

import { CashRegisterActions } from "@/components/actions"
import { SortBtn } from "@/components/buttons"
import {
  BooleanFilter,
  DateFilter,
  NumberFilter,
  StringFilter,
} from "@/components/ui/data-table"
import { EM_DASH } from "@/constants/consts"
import { CashRegisterSchemaT, UserSchemaT } from "@/db/app/schema"
import { formatDate, formatNumber } from "@/lib/utils"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { CheckCircleIcon, XCircleIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { FavoriteCell } from "../cell"
import { Badge } from "../ui/badge"

type SchemaT = CashRegisterSchemaT & {
  user_closedBy: UserSchemaT | null
}

const IsOpenCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const t = useTranslations()
  const Icon = original.isOpen ? CheckCircleIcon : XCircleIcon

  return (
    <Badge variant="outline">
      <Icon className="mr-1" size={15} />
      {original.isOpen ? t("Yes") : t("No")}
    </Badge>
  )
}

const columns: ColumnDef<SchemaT>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div>
        <SortBtn text="Name" column={column} />
        <StringFilter title="Name" column={column} />
      </div>
    ),
  },
  {
    accessorKey: "openedAt",
    header: ({ column }) => (
      <div>
        <SortBtn text="Opened at" column={column} />
        <DateFilter title="Opened at" column={column} />
      </div>
    ),
    cell: ({ row }) => formatDate(new Date(row.original.openedAt)),
    filterFn: "dateRange",
  },
  {
    accessorKey: "openingBalance",
    header: ({ column }) => (
      <div>
        <SortBtn text="Opening balance" column={column} />
        <NumberFilter title="Opening balance" column={column} />
      </div>
    ),
    cell: ({ row }) => formatNumber(row.original.openingBalance),
    filterFn: "numberRange",
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <div>
        <SortBtn text="Balance" column={column} />
        <NumberFilter title="Balance" column={column} />
      </div>
    ),
    cell: ({ row }) => formatNumber(row.original.balance),
    filterFn: "numberRange",
  },
  {
    accessorKey: "isOpen",
    header: ({ column }) => (
      <div>
        <SortBtn text="Is open" column={column} />
        <BooleanFilter title="Is open" column={column} />
      </div>
    ),
    cell: IsOpenCell,
  },
  {
    accessorKey: "closedAt",
    header: ({ column }) => (
      <div>
        <SortBtn text="Closed at" column={column} />
        <DateFilter title="Closed at" column={column} />
      </div>
    ),
    cell: ({ row }) => {
      const { closedAt } = row.original
      return closedAt ? formatDate(new Date(closedAt)) : EM_DASH
    },
    filterFn: "dateRange",
  },
  {
    accessorKey: "user_closedBy.displayName",
    header: ({ column }) => (
      <div>
        <SortBtn text="Closed by" column={column} />
        <StringFilter title="Closed by" column={column} />
      </div>
    ),
    cell: ({ row }) => {
      const { user_closedBy } = row.original
      return user_closedBy ? user_closedBy.displayName : EM_DASH
    },
  },
  {
    accessorKey: "closingBalanace",
    header: ({ column }) => (
      <div>
        <SortBtn text="Closing balance" column={column} />
        <NumberFilter title="Closing balance" column={column} />
      </div>
    ),
    cell: ({ row }) => {
      const { closingBalanace } = row.original
      return closingBalanace ? formatNumber(closingBalanace) : EM_DASH
    },
    filterFn: "numberRange",
  },
  {
    accessorKey: "isFavorite",
    header: ({ column }) => (
      <div>
        <SortBtn text="Favorite" column={column} />
        <BooleanFilter title="Favorite" column={column} />
      </div>
    ),
    cell: FavoriteCell,
  },
  {
    id: "actions",
    cell: CashRegisterActions,
  },
]

export { columns as cashRegisterColumns }
