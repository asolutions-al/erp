"use client"

import { SortBtn } from "@/components/buttons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import {
  CheckCircleIcon,
  MoreHorizontal,
  TrashIcon,
  XCircleIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
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

type ConfirmationDialog = {
  action: "promote" | "demote" | "delete"
  newRole: OrgMemberRoleT
}

const PromoteDropdown = ({
  newRole,
  setConfirmationDialog,
}: {
  newRole: OrgMemberRoleT
  setConfirmationDialog: (dialog: ConfirmationDialog | null) => void
}) => {
  const t = useTranslations()
  const Icon = mapOrgMemberRoleIcon(newRole)

  return (
    <DropdownMenuItem
      onClick={() => setConfirmationDialog({ action: "promote", newRole })}
    >
      <Icon className="mr-2 h-4 w-4" />
      {t("Promote to {role}", { role: newRole })}
    </DropdownMenuItem>
  )
}

const PromoteAlertContent = ({
  id,
  role,
  newRole,
  name,
}: {
  id: string
  role: OrgMemberRoleT
  newRole: OrgMemberRoleT
  name: string
}) => {
  const t = useTranslations()
  const router = useRouter()

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {t("Do you want to promote {name} to {role}", {
            name,
            role,
          })}
          ?
        </AlertDialogTitle>
        <AlertDialogDescription>
          {t("When you promote to {role}", {
            role,
          })}
          :
        </AlertDialogDescription>
        <ul className="list-inside list-disc">
          <li>
            {t("The member will gain additional permissions and access rights")}
          </li>
          <li>
            {t(
              "They will be able to manage other members and organization settings"
            )}
          </li>
          <li>
            {t(
              "This action will immediately update their role and permissions"
            )}
          </li>
          <li>{t("The member will be notified of their new role")}</li>
        </ul>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>
          <XCircleIcon />
          {t("Cancel")}
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={async () => {
            const res = await updateOrgMemberRole({
              id,
              role: newRole,
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
          <CheckCircleIcon />
          {t("Yes, promote")}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

const DemoteDropdown = ({
  newRole,
  setConfirmationDialog,
}: {
  newRole: OrgMemberRoleT
  setConfirmationDialog: (dialog: ConfirmationDialog | null) => void
}) => {
  const t = useTranslations()
  const Icon = mapOrgMemberRoleIcon(newRole)

  return (
    <DropdownMenuItem
      onClick={() => setConfirmationDialog({ action: "demote", newRole })}
    >
      <Icon className="mr-2 h-4 w-4" />
      {t("Demote to {role}", { role: newRole })}
    </DropdownMenuItem>
  )
}

const DemoteAlertContent = ({
  id,
  role,
  newRole,
  name,
}: {
  id: string
  role: OrgMemberRoleT
  newRole: OrgMemberRoleT
  name: string
}) => {
  const t = useTranslations()
  const router = useRouter()

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {t("Do you want to demote {name} to {role}", {
            name,
            role,
          })}
          ?
        </AlertDialogTitle>
        <AlertDialogDescription>
          {t("When you demote to {role}", {
            role,
          })}
          :
        </AlertDialogDescription>
        <ul className="list-inside list-disc">
          <li>
            {t(
              "The member will lose their current permissions and access rights"
            )}
          </li>
          <li>{t("They will have limited access to organization features")}</li>
          <li>
            {t(
              "This action will immediately update their role and permissions"
            )}
          </li>
          <li>{t("The member will be notified of their new role")}</li>
        </ul>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>
          <XCircleIcon />
          {t("Cancel")}
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={async () => {
            const res = await updateOrgMemberRole({
              id,
              role: newRole,
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
          <CheckCircleIcon />
          {t("Yes, demote")}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

const DeleteDropdown = ({
  role,
  setConfirmationDialog,
}: {
  role: OrgMemberRoleT
  setConfirmationDialog: (dialog: ConfirmationDialog | null) => void
}) => {
  const t = useTranslations()
  return (
    <DropdownMenuItem
      onClick={() =>
        setConfirmationDialog({
          action: "delete",
          newRole: role,
        })
      }
      className="text-destructive"
    >
      <TrashIcon className="mr-2 h-4 w-4" />
      {t("Remove {role}", { role })}
    </DropdownMenuItem>
  )
}

const DeleteAlertContent = ({
  id,
  role,
  name,
}: {
  id: string
  role: OrgMemberRoleT
  name: string
}) => {
  const t = useTranslations()
  const router = useRouter()

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {t("Do you want to remove {name}", { name })}?
        </AlertDialogTitle>
        <AlertDialogDescription>
          {t("When you remove a member")}:
        </AlertDialogDescription>
        <ul className="list-inside list-disc">
          <li>{t("The member will lose access to this organization")}</li>
          <li>
            {t(
              "They will no longer be able to view or manage organization data"
            )}
          </li>
          <li>{t("All their permissions and roles will be revoked")}</li>
          <li>{t("The member will be notified of their removal")}</li>
          <li>{t("This action is final and cannot be undone")}</li>
        </ul>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>
          <XCircleIcon />
          {t("Cancel")}
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={async () => {
            const res = await deleteOrgMember(id)
            if (res.error) {
              toast.error(res.error.message)
            }
            if (res.success) {
              toast.success(t("{role} removed", { role }))
              router.refresh()
            }
          }}
        >
          <CheckCircleIcon />
          {t("Yes, remove")}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

const ActionsCell = (props: CellContext<SchemaT, unknown>) => {
  const { row, table } = props
  const { original } = row
  const { userId, role } = table.options.meta as GlobalTableMetaT
  const t = useTranslations()
  const [confirmationDialog, setConfirmationDialog] =
    useState<ConfirmationDialog | null>(null)

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
    <>
      <DropdownMenu modal={false}>
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
              <PromoteDropdown
                newRole="admin"
                setConfirmationDialog={setConfirmationDialog}
              />
              <PromoteDropdown
                newRole="owner"
                setConfirmationDialog={setConfirmationDialog}
              />
            </>
          )}

          {canChangeRole && original.role === "admin" && (
            <>
              <PromoteDropdown
                newRole="owner"
                setConfirmationDialog={setConfirmationDialog}
              />
              <DemoteDropdown
                newRole="member"
                setConfirmationDialog={setConfirmationDialog}
              />
            </>
          )}

          {canChangeRole && original.role === "owner" && (
            <>
              <DemoteDropdown
                newRole="admin"
                setConfirmationDialog={setConfirmationDialog}
              />
              <DemoteDropdown
                newRole="member"
                setConfirmationDialog={setConfirmationDialog}
              />
            </>
          )}

          {canDelete && (
            <DeleteDropdown
              role={original.role}
              setConfirmationDialog={setConfirmationDialog}
            />
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={!!confirmationDialog}
        onOpenChange={(open) =>
          setConfirmationDialog(open ? confirmationDialog : null)
        }
      >
        {confirmationDialog?.action === "promote" && (
          <PromoteAlertContent
            id={original.id}
            role={role}
            newRole={confirmationDialog.newRole}
            name={original.user.email}
          />
        )}
        {confirmationDialog?.action === "demote" && (
          <DemoteAlertContent
            id={original.id}
            role={role}
            newRole={confirmationDialog.newRole}
            name={original.user.email}
          />
        )}
        {confirmationDialog?.action === "delete" && (
          <DeleteAlertContent
            id={original.id}
            role={role}
            name={original.user.email}
          />
        )}
      </AlertDialog>
    </>
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

export { columns as orgMemberColumns }
