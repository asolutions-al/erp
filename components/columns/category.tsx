"use client"

import { CategoryActions } from "@/components/actions"
import { SortBtn } from "@/components/buttons"
import { CategorySchemaT } from "@/db/app/schema"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

type SchemaT = CategorySchemaT

const StatusCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.status)
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
    accessorKey: "isFavorite",
    header: ({ column }) => <SortBtn text="Favorite" column={column} />,
    cell: FavoriteCell,
  },
  {
    id: "actions",
    cell: CategoryActions,
  },
]

export { columns as categoryColumns }
