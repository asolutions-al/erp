"use client"

import { CustomerInvoicesSheet } from "@/components/sheet/customer-invoices"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { markCustomerAsFavorite } from "@/db/app/actions/customer"
import { CustomerSchemaT } from "@/db/app/schema"
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
import { useState } from "react"
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
          <DropdownMenuItem onClick={() => setSelectedCustomer(original)}>
            <FileTextIcon />
            {t("View invoices")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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

      <CustomerInvoicesSheet
        customer={selectedCustomer}
        onOpenChange={(open) => {
          if (!open) setSelectedCustomer(null)
        }}
      />
    </>
  )
}

export { Actions as CustomerActions }
