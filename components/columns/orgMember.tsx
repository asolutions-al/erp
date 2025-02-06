"use client"

import { SortBtn } from "@/components/buttons"
import { OrgMemberSchemaT, UserSchemaT } from "@/db/app/schema"
import { ColumnDef } from "@tanstack/react-table"

type SchemaT = OrgMemberSchemaT & {
  user: UserSchemaT
}

const columns: ColumnDef<SchemaT>[] = [
  {
    accessorKey: "user.email",
    header: ({ column }) => <SortBtn text="Member" column={column} />,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <SortBtn text="Role" column={column} />,
  },
]

export { columns as orgMemberColumns }
