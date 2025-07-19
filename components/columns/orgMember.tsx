"use client"

import { SortBtn } from "@/components/buttons"
import { SelectFilter, StringFilter } from "@/components/ui/data-table"
import { OrgMemberSchemaT, UserSchemaT } from "@/db/app/schema"
import { ColumnDef } from "@tanstack/react-table"

type SchemaT = OrgMemberSchemaT & {
  user: UserSchemaT
}

const columns: ColumnDef<SchemaT>[] = [
  {
    accessorKey: "user.email",
    header: ({ column }) => (
      <div>
        <SortBtn text="Member" column={column} />
        <StringFilter title="Member" column={column} />
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <div>
        <SortBtn text="Role" column={column} />
        <SelectFilter title="Role" column={column} />
      </div>
    ),
    filterFn: "equals",
  },
]

export { columns as orgMemberColumns }
