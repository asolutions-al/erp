"use client"

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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { closeCashRegister } from "@/db/app/actions/cashRegister"
import { CashRegisterSchemaT } from "@/db/app/schema"
import { CellContext } from "@tanstack/react-table"
import {
  CheckCircleIcon,
  CopyPlusIcon,
  EditIcon,
  KeyRoundIcon,
  MoreHorizontalIcon,
  XCircleIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

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
        <DropdownMenu modal={false}>
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
            <AlertDialogTitle>
              {t("Do you want to close the cash register")}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <p>{t("When you close the cash register")}:</p>
              <ul className="list-inside list-disc">
                <li>
                  {t(
                    "The cash register will be archived and no longer available for new transactions"
                  )}
                </li>
                <li>{t("The closing balance will be recorded and locked")}</li>
                <li>
                  {t(
                    "You will not be able to select this cash register for new sales"
                  )}
                </li>
                <li>
                  {t(
                    "All linked invoice configurations will be unassigned from this cash register"
                  )}
                </li>
                <li>{t("This action is final and cannot be undone")}</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <XCircleIcon />
              {t("Cancel")}
            </AlertDialogCancel>
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
              <CheckCircleIcon />
              {t("Yes, close")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export { Actions as CashRegisterActions }
