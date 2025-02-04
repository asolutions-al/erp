"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CustomerSchemaT } from "@/db/app/schema"
import { CellContext } from "@tanstack/react-table"
import { CopyPlusIcon, EditIcon, MoreHorizontalIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"

type SchemaT = CustomerSchemaT

const Actions = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { unitId, orgId } = useParams()
  const { original } = row
  return (
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { Actions as CustomerActions }
