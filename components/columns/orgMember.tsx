"use client"

import { SortBtn } from "@/components/buttons"
import {
  DateFilter,
  SelectFilter,
  StringFilter,
} from "@/components/ui/data-table"
import { mapOrgMemberRoleIcon } from "@/constants/maps"
import {
  deleteOrgMember,
  updateOrgMemberRole,
} from "@/db/app/actions/orgMember"
import { OrgMemberSchemaT, UserSchemaT } from "@/db/app/schema"
import { formatDate } from "@/lib/utils"
import { OrgMemberRoleT } from "@/types/enum"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, TrashIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { RoleCell } from "../cell"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

type SchemaT = OrgMemberSchemaT & {
  user: UserSchemaT
}

type TableMeta = {
  userId: string
  role: "owner" | "admin" | "member"
}

const PromoteDropdown = ({
  id,
  role,
}: {
  id: string
  role: OrgMemberRoleT
}) => {
  const t = useTranslations()
  const router = useRouter()
  const Icon = mapOrgMemberRoleIcon(role)

  return (
    <DropdownMenuItem
      onClick={async () => {
        const res = await updateOrgMemberRole({
          id,
          role,
        })
        if (res.error) {
          toast.error(res.error.message)
        }
        if (res.success) {
          toast.success(t("Role updated"))
          router.refresh()
        }
      }}
    >
      <Icon className="mr-2 h-4 w-4" />
      {t("Promote to {role}", { action: "Promote", role })}
    </DropdownMenuItem>
  )
}

const DemoteDropdown = ({ id, role }: { id: string; role: OrgMemberRoleT }) => {
  const t = useTranslations()
  const router = useRouter()
  const Icon = mapOrgMemberRoleIcon(role)

  return (
    <DropdownMenuItem
      onClick={async () => {
        const res = await updateOrgMemberRole({
          id,
          role,
        })
        if (res.error) {
          toast.error(res.error.message)
        }
        if (res.success) {
          toast.success(t("Role updated"))
          router.refresh()
        }
      }}
    >
      <Icon className="mr-2 h-4 w-4" />
      {t("Demote to {role}", { role })}
    </DropdownMenuItem>
  )
}

const DeleteDropdown = ({ id }: { id: string }) => {
  const t = useTranslations()
  const router = useRouter()
  return (
    <DropdownMenuItem
      className="text-destructive"
      onClick={async () => {
        const res = await deleteOrgMember(id)
        if (res.error) {
          toast.error(res.error.message)
        }
        if (res.success) {
          toast.success(t("Member removed"))
          router.refresh()
        }
      }}
    >
      <TrashIcon className="mr-2 h-4 w-4" />
      {t("Remove Member")}
    </DropdownMenuItem>
  )
}

const ActionsCell = (props: CellContext<SchemaT, unknown>) => {
  const { row, table } = props
  const { original } = row
  const { userId, role } = table.options.meta as TableMeta
  const t = useTranslations()

  if (role === "member") return null
  if (original.userId === userId) return null

  /**
   * Only owner can change role
   */
  const canChangeRole = role === "owner"

  /**
   * Owner can delete anyone
   * Admin can only delete members
   * Members cannot delete anyone
   */
  const canDelete =
    role === "owner" || (role === "admin" && original.role === "member")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {canChangeRole && original.role === "member" && (
          <>
            <PromoteDropdown id={original.id} role="admin" />
            <PromoteDropdown id={original.id} role="owner" />
          </>
        )}

        {canChangeRole && original.role === "admin" && (
          <>
            <PromoteDropdown id={original.id} role="owner" />
            <DemoteDropdown id={original.id} role="member" />
          </>
        )}

        {canChangeRole && original.role === "owner" && (
          <>
            <DemoteDropdown id={original.id} role="admin" />
            <DemoteDropdown id={original.id} role="member" />
          </>
        )}

        {canDelete && <DeleteDropdown id={original.id} />}
      </DropdownMenuContent>
    </DropdownMenu>
  )
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
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div>
        <SortBtn text="Joined date" column={column} />
        <DateFilter title="Joined date" column={column} />
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

export { columns as orgMemberColumns, type TableMeta as OrgMemberTableMeta }
