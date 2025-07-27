"use client"

import { SortBtn } from "@/components/buttons"
import {
  DateFilter,
  SelectFilter,
  StringFilter,
} from "@/components/ui/data-table"
import { mapInvitationStatusIcon } from "@/constants/maps"
import { deleteInvitation, resendInvitation } from "@/db/app/actions"
import { InvitationSchemaT } from "@/db/app/schema"
import { formatDate } from "@/lib/utils"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { Mail, MoreHorizontal, TrashIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
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
  return t(original.role)
}

const StatusCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const { status } = original
  const t = useTranslations()

  const Icon = mapInvitationStatusIcon(status)

  return (
    <Badge
      variant={
        status === "REJECTED"
          ? "destructive"
          : status === "ACCEPTED"
            ? "default"
            : "secondary"
      }
    >
      <Icon className="mr-1" size={15} />
      {t(status)}
    </Badge>
  )
}

const ActionsCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const t = useTranslations()
  const router = useRouter()

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
          <DropdownMenuItem
            onClick={async () => {
              const res = await resendInvitation(original.id)
              if (res.error) {
                toast.error(res.error.message)
              }
              if (res.success) {
                toast.success(t("Invitation resent"))
                router.refresh()
              }
            }}
          >
            <Mail className="mr-2 h-4 w-4" />
            {t("Resend Invitation")}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="text-destructive"
          onClick={async () => {
            const res = await deleteInvitation(original.id)
            if (res.error) {
              toast.error(res.error.message)
            }
            if (res.success) {
              toast.success(t("Invitation deleted"))
              router.refresh()
            }
          }}
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          {t("Delete Invitation")}
        </DropdownMenuItem>
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
        <SortBtn text="Invitation date" column={column} />
        <DateFilter title="Invitation date" column={column} />
      </div>
    ),
    cell: ({ row }) => formatDate(new Date(row.original.createdAt)),
    filterFn: "dateRange",
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
]

export { columns as invitationColumns, type SchemaT as InvitationColsT }
