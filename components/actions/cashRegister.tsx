"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { closeCashRegister } from "@/db/app/actions"
import { CashRegisterSchemaT } from "@/db/app/schema"
import { CellContext } from "@tanstack/react-table"
import {
  CopyPlusIcon,
  EditIcon,
  KeyRoundIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"

type SchemaT = CashRegisterSchemaT

const Actions = ({ row }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const t = useTranslations()
  const { unitId, orgId } = useParams()
  const router = useRouter()

  const { isOpen } = row.original

  return (
    <>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t("Open menu")}</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
            <Link
              href={`/o/${orgId}/u/${unitId}/cashRegister/${original.id}/update`}
              passHref
            >
              <DropdownMenuItem>
                <EditIcon />
                {t("Edit")}
              </DropdownMenuItem>
            </Link>
            <Link
              href={`/o/${orgId}/u/${unitId}/cashRegister/${original.id}/duplicate`}
              passHref
            >
              <DropdownMenuItem>
                <CopyPlusIcon />
                {t("Duplicate")}
              </DropdownMenuItem>
            </Link>

            {isOpen && (
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>
                  <KeyRoundIcon />
                  {t("Close cash register")}
                </DropdownMenuItem>
              </AlertDialogTrigger>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Are you absolutely sure")}?</AlertDialogTitle>
            <AlertDialogDescription>
              {t("This action cannot be undone")}.{" "}
              {t("This will permanently close the cash register")}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  await closeCashRegister(original.id)
                  toast.success(t("Cash register closed successfully"))
                  router.refresh()
                } catch (error) {
                  toast.error(t("An error occurred"))
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export { Actions as CashRegisterActions }
