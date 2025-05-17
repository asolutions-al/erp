"use client"

import { CashRegisterActions } from "@/components/actions"
import { SortBtn } from "@/components/buttons"
import { CashRegisterSchemaT } from "@/db/app/schema"
import { formatDate, formatNumber } from "@/lib/utils"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

type SchemaT = CashRegisterSchemaT

const StatusCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.status)
}
const IsOpenCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const t = useTranslations()
  return original.isOpen ? t("Yes") : t("No")
}
const FavoriteCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const t = useTranslations()
  return original.isFavorite ? t("Yes") : t("No")
}

const columns: ColumnDef<SchemaT>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortBtn text="Name" column={column} />,
  },
  {
    accessorKey: "openedAt",
    header: ({ column }) => <SortBtn text="Opened at" column={column} />,
    cell: ({ row }) => formatDate(new Date(row.original.openedAt)),
  },
  {
    accessorKey: "openingBalance",
    header: ({ column }) => <SortBtn text="Opening balance" column={column} />,
    cell: ({ row }) => formatNumber(row.original.openingBalance),
  },
  {
    accessorKey: "balance",
    header: ({ column }) => <SortBtn text="Balance" column={column} />,
    cell: ({ row }) => formatNumber(row.original.balance),
  },
  {
    accessorKey: "isOpen",
    header: ({ column }) => <SortBtn text="Is open" column={column} />,
    cell: IsOpenCell,
  },
  {
    accessorKey: "closedAt",
    header: ({ column }) => <SortBtn text="Closed at" column={column} />,
    cell: ({ row }) => {
      const { closedAt } = row.original
      return closedAt ? formatDate(new Date(closedAt)) : "-"
    },
  },
  {
    accessorKey: "closingBalanace",
    header: ({ column }) => <SortBtn text="Closing balance" column={column} />,
    cell: ({ row }) => {
      const { closingBalanace } = row.original
      return closingBalanace ? formatNumber(closingBalanace) : "-"
    },
  },
  {
    accessorKey: "isFavorite",
    header: ({ column }) => <SortBtn text="Favorite" column={column} />,
    cell: FavoriteCell,
  },
  {
    id: "actions",
    cell: CashRegisterActions,
  },
]

export { columns as cashRegisterColumns }
