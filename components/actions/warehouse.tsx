"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WarehouseSchemaT } from "@/db/app/schema"
import { CellContext } from "@tanstack/react-table"
import { CopyPlusIcon, EditIcon, MoreHorizontalIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"

type SchemaT = WarehouseSchemaT

const Actions = ({ row }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const t = useTranslations()
  const { unitId, orgId } = useParams()

  return (
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
          href={`/o/${orgId}/u/${unitId}/warehouse/${original.id}/update`}
          passHref
        >
          <DropdownMenuItem>
            <EditIcon />
            {t("Edit")}
          </DropdownMenuItem>
        </Link>
        <Link
          href={`/o/${orgId}/u/${unitId}/warehouse/${original.id}/duplicate`}
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

export { Actions as WarehouseActions }
