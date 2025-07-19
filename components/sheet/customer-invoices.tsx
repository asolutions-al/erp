"use client"

import { invoiceColumns } from "@/components/columns/invoice"
import { DataTable } from "@/components/ui/data-table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { getCustomerInvoices } from "@/db/app/actions/customer"
import { CustomerSchemaT, InvoiceSchemaT } from "@/db/app/schema"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type Props = {
  customer: CustomerSchemaT | null
  onOpenChange: (open: boolean) => void
}

const InvoiceTableSkeleton = () => {
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

export const CustomerInvoicesSheet = ({ customer, onOpenChange }: Props) => {
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
          <SheetDescription>
            {loading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              t("{count} invoices", { count: invoices.length })
            )}
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <InvoiceTableSkeleton />
        ) : customer ? (
          <DataTable columns={invoiceColumns} data={invoices} />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
