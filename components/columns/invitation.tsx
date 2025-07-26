"use client"

import { SortBtn } from "@/components/buttons"
import {
  DateFilter,
  SelectFilter,
  StringFilter,
} from "@/components/ui/data-table"
import { InvitationSchemaT } from "@/db/app/schema"
import { formatDate } from "@/lib/utils"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { Mail, MoreHorizontal, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

type SchemaT = InvitationSchemaT

const RoleCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const t = useTranslations()
  return <div>{t(original.role)}</div>
}

const StatusCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const t = useTranslations()
  const variant =
    original.status === "PENDING"
      ? "secondary"
      : original.status === "ACCEPTED"
        ? "default"
        : "destructive"
  return <Badge variant={variant}>{t(original.status)}</Badge>
}

const ActionsCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const t = useTranslations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {original.status === "PENDING" && (
          <>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              {t("Resend Invitation")}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <X className="mr-2 h-4 w-4" />
              {t("Cancel Invitation")}
            </DropdownMenuItem>
          </>
        )}
        {original.status === "REJECTED" && (
          <DropdownMenuItem className="text-destructive">
            <X className="mr-2 h-4 w-4" />
            {t("Remove Invitation")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const columns: ColumnDef<SchemaT>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <div>
        <SortBtn text="Email" column={column} />
        <StringFilter title="Email" column={column} />
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
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div>
        <SortBtn text="Status" column={column} />
        <SelectFilter title="Status" column={column} />
      </div>
    ),
    cell: StatusCell,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div>
        <SortBtn text="Invited" column={column} />
        <DateFilter title="Invited" column={column} />
      </div>
    ),
    cell: ({ row }) => formatDate(new Date(row.original.createdAt)),
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
]

export { columns as invitationColumns, type SchemaT as InvitationColsT }
