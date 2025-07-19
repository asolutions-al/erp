"use client"

import { UnitActions } from "@/components/actions/unit"
import { SortBtn } from "@/components/buttons"
import { StringFilter } from "@/components/ui/data-table"
import { UnitSchemaT } from "@/db/app/schema"
import { ColumnDef } from "@tanstack/react-table"

// You can add more columns as needed
const columns: ColumnDef<UnitSchemaT>[] = [
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
    accessorKey: "description",
    header: ({ column }) => (
      <div>
        <SortBtn text="Description" column={column} />
        <StringFilter title="Description" column={column} />
      </div>
    ),
  },
  {
    id: "actions",
    cell: UnitActions,
  },
]

export { columns as unitColumns }
