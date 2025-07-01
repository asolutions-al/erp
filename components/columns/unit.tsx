"use client"

import { UnitActions } from "@/components/actions/unit"
import { SortBtn } from "@/components/buttons"
import { UnitSchemaT } from "@/db/app/schema"
import { ColumnDef } from "@tanstack/react-table"

// You can add more columns as needed
const columns: ColumnDef<UnitSchemaT>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortBtn text="Name" column={column} />,
  },
  {
    accessorKey: "description",
    header: ({ column }) => <SortBtn text="Description" column={column} />,
  },
  {
    id: "actions",
    cell: UnitActions,
  },
]

export { columns as unitColumns }
