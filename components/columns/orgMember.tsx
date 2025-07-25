"use client"

import { SortBtn } from "@/components/buttons"
import { SelectFilter, StringFilter } from "@/components/ui/data-table"
import { OrgMemberSchemaT, UserSchemaT } from "@/db/app/schema"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

type SchemaT = OrgMemberSchemaT & {
  user: UserSchemaT
}

const RoleCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const t = useTranslations()
  return <div>{t(original.role)}</div>
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
    cell: RoleCell,
  },
]

export { columns as orgMemberColumns }
