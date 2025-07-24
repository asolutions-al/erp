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
import { markWarehouseAsFavorite } from "@/db/app/actions"
import {
  ProductInventorySchemaT,
  ProductSchemaT,
  WarehouseSchemaT,
} from "@/db/app/schema"
import { CellContext } from "@tanstack/react-table"
import {
  CopyPlusIcon,
  EditIcon,
  MoreHorizontalIcon,
  StarIcon,
  StarOffIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

type SchemaT = WarehouseSchemaT & {
  productInventories: (Pick<ProductInventorySchemaT, "stock"> & {
    product: Pick<ProductSchemaT, "status">
  })[]
}

const Actions = ({ row }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const t = useTranslations()
  const { unitId, orgId } = useParams<GlobalParamsT>()
  const router = useRouter()

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
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            try {
              await markWarehouseAsFavorite({
                id: original.id,
                isFavorite: !original.isFavorite,
              })
              toast.success(t("Warehouse saved successfully"))
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
  )
}

export { Actions as WarehouseActions }
