"use client"

import { SortBtn } from "@/components/buttons"
import { StringFilter } from "@/components/ui/data-table"
import { OrgSchemaT } from "@/db/app/schema"
import { ColumnDef } from "@tanstack/react-table"

type SchemaT = OrgSchemaT

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
    accessorKey: "description",
    header: ({ column }) => (
      <div>
        <SortBtn text="Description" column={column} />
        <StringFilter title="Description" column={column} />
      </div>
    ),
  },
]

export { columns as orgColumns }
