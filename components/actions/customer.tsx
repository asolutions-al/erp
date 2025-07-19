"use client"

import { invoiceColumns } from "@/components/columns/invoice"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getCustomerInvoices,
  markCustomerAsFavorite,
} from "@/db/app/actions/customer"
import { CustomerSchemaT, InvoiceSchemaT } from "@/db/app/schema"
import { CellContext } from "@tanstack/react-table"
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

type SchemaT = CustomerSchemaT

const Actions = ({ row }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const t = useTranslations()
  const { unitId, orgId } = useParams()
  const router = useRouter()
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerSchemaT | null>(null)

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
          <Link
            href={`/o/${orgId}/u/${unitId}/customer/update/${original.id}`}
            passHref
          >
            <DropdownMenuItem>
              <EditIcon />
              {t("Edit")}
            </DropdownMenuItem>
          </Link>
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
          <DropdownMenuItem onClick={() => setSelectedCustomer(original)}>
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
        customer={selectedCustomer}
        onOpenChange={(open) => {
          if (!open) setSelectedCustomer(null)
        }}
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

const InvoicesSheet = ({
  customer,
  onOpenChange,
}: {
  customer: CustomerSchemaT | null
  onOpenChange: (open: boolean) => void
}) => {
  const [invoices, setInvoices] = useState<InvoiceSchemaT[]>([])
  const [loading, setLoading] = useState(false)
  const { unitId, orgId } = useParams()
  const t = useTranslations()

  useEffect(() => {
    if (!customer) {
      setInvoices([])
      return
    }

    const fetchInvoices = async () => {
      setLoading(true)
      try {
        const result = await getCustomerInvoices({
          customerId: customer.id,
          unitId: unitId as string,
          orgId: orgId as string,
        })
        setInvoices(result)
      } catch (error) {
        toast.error("Failed to load customer invoices")
        onOpenChange(false)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [customer, unitId, orgId, onOpenChange])

  return (
    <Sheet open={!!customer} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[800px] sm:max-w-[800px]">
        <SheetHeader className="mb-4">
          <SheetTitle>
            {t("Invoices for {name}", { name: customer?.name || "" })}
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
        ) : customer ? (
          <DataTable columns={invoiceColumns} data={invoices} />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

export { Actions as CustomerActions }
