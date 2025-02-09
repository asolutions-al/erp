"use client"

import { CashRegisterActions } from "@/components/actions"
import { SortBtn } from "@/components/buttons"
import { CashRegisterSchemaT } from "@/db/app/schema"
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

const columns: ColumnDef<SchemaT>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortBtn text="Name" column={column} />,
  },
  {
    accessorKey: "balance",
    header: ({ column }) => <SortBtn text="Balance" column={column} />,
  },
  {
    accessorKey: "isOpen",
    header: ({ column }) => <SortBtn text="Is open" column={column} />,
    cell: IsOpenCell,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortBtn text="Status" column={column} />,
    cell: StatusCell,
  },
  {
    id: "actions",
    cell: CashRegisterActions,
  },
]

export { columns as cashRegisterColumns }
