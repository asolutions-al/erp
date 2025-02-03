"use client"

import { SortBtn } from "@/components/buttons"
import { OrgSchemaT } from "@/db/app/schema"
import { ColumnDef } from "@tanstack/react-table"

type SchemaT = OrgSchemaT & {
  unitsCount: number
}

const columns: ColumnDef<SchemaT>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortBtn text="Name" column={column} />,
  },
  {
    accessorKey: "description",
    header: ({ column }) => <SortBtn text="Description" column={column} />,
  },
  {
    accessorKey: "unitsCount",
    header: ({ column }) => <SortBtn text="Number of units" column={column} />,
  },
]

export { columns as orgColumns }
