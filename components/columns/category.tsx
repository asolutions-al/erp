"use client"

import { CategoryActions } from "@/components/actions"
import { SortBtn } from "@/components/buttons"
import { BooleanFilter, StringFilter } from "@/components/ui/data-table"
import { CategorySchemaT } from "@/db/app/schema"
import { ColumnDef } from "@tanstack/react-table"
import { FavoriteCell } from "../cell"

type SchemaT = CategorySchemaT

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
    cell: CategoryActions,
  },
]

export { columns as categoryColumns }
