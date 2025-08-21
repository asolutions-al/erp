"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { getCustomerInvoices, markCustomerAsFavorite } from "@/db/app/actions"
import {
  CashRegisterSchemaT,
  CustomerSchemaT,
  InvoiceSchemaT,
  UserSchemaT,
  WarehouseSchemaT,
} from "@/db/app/schema"
import { canEdit } from "@/lib/utils"
import { CellContext, Row } from "@tanstack/react-table"
import {
  CopyPlusIcon,
  EditIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  StarIcon,
  StarOffIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { invoiceColumns } from "../columns/invoice"
import { DataTable } from "../ui/data-table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet"

type SchemaT = CustomerSchemaT

const Actions = ({ row, table }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const { role } = table.options.meta as GlobalTableMetaT
  const t = useTranslations()
  const { unitId, orgId } = useParams<GlobalParamsT>()
  const router = useRouter()
  const [invoicesSheetOpen, setInvoicesSheetOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t("Open menu")}</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
          {canEdit(role) && (
            <Link
              href={`/o/${orgId}/u/${unitId}/customer/update/${original.id}`}
              passHref
            >
              <DropdownMenuItem>
                <EditIcon />
                {t("Edit")}
              </DropdownMenuItem>
            </Link>
          )}
          <Link
            href={`/o/${orgId}/u/${unitId}/customer/duplicate/${original.id}`}
            passHref
          >
            <DropdownMenuItem>
              <CopyPlusIcon />
              {t("Duplicate")}
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setInvoicesSheetOpen(true)}>
            <FileTextIcon />
            {t("View invoices")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              try {
                await markCustomerAsFavorite({
                  id: original.id,
                  isFavorite: !original.isFavorite,
                })
                toast.success(t("Customer saved successfully"))
                router.refresh()
              } catch (error) {
                toast.error(t("An error occurred"))
              }
            }}
          >
            {original.isFavorite ? <StarOffIcon /> : <StarIcon />}
            {original.isFavorite
              ? t("Unmark as favorite")
              : t("Mark as favorite")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InvoicesSheet
        open={invoicesSheetOpen}
        onOpenChange={setInvoicesSheetOpen}
        row={row}
      />
    </>
  )
}

const TableSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Table header skeleton */}
      <div className="grid grid-cols-6 gap-4 border-b pb-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-8" />
      </div>

      {/* Table rows skeleton */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="grid grid-cols-6 gap-4 py-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>
  )
}

type InvoicesSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  row: Row<SchemaT>
}

const InvoicesSheet = ({ open, onOpenChange, row }: InvoicesSheetProps) => {
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex min-w-[800px] flex-col sm:max-w-[800px]">
          <InvoicesSheetContent
            open={open}
            onOpenChange={onOpenChange}
            row={row}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}

const InvoicesSheetContent = ({ row }: InvoicesSheetProps) => {
  const { original } = row
  const [invoices, setInvoices] = useState<
    (InvoiceSchemaT & {
      warehouse: WarehouseSchemaT | null
      cashRegister: CashRegisterSchemaT | null
      user_createdBy: UserSchemaT | null
    })[]
  >([])
  const [loading, setLoading] = useState(false)
  const { unitId, orgId } = useParams<GlobalParamsT>()
  const t = useTranslations()

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true)
      try {
        const result = await getCustomerInvoices({
          customerId: original.id,
          unitId,
          orgId,
        })
        setInvoices(result)
      } catch (error) {
        toast.error("Failed to load customer invoices")
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [original, unitId, orgId])

  return (
    <>
      <SheetHeader className="mb-4">
        <SheetTitle>
          {t("Invoices for {name}", { name: original.name })}
        </SheetTitle>
        {loading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <SheetDescription>
            {t("{count} invoices", { count: invoices.length })}
          </SheetDescription>
        )}
      </SheetHeader>

      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable columns={invoiceColumns} data={invoices} />
      )}
    </>
  )
}

export { Actions as CustomerActions }
