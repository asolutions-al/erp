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
import { markCategoryAsFavorite } from "@/db/app/actions"
import { CategorySchemaT } from "@/db/app/schema"
import { canEdit } from "@/lib/utils"
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

type SchemaT = CategorySchemaT

const Actions = ({ row, table }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const { role } = table.options.meta as GlobalTableMetaT
  const t = useTranslations()
  const { unitId, orgId } = useParams<GlobalParamsT>()
  const router = useRouter()

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

        <DropdownMenuSeparator />
        {canEdit(role) && (
          <Link
            href={`/o/${orgId}/u/${unitId}/category/update/${original.id}`}
            passHref
          >
            <DropdownMenuItem>
              <EditIcon />
              {t("Edit")}
            </DropdownMenuItem>
          </Link>
        )}
        <Link
          href={`/o/${orgId}/u/${unitId}/category/duplicate/${original.id}`}
          passHref
        >
          <DropdownMenuItem>
            <CopyPlusIcon />
            {t("Duplicate")}
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onClick={async () => {
            try {
              await markCategoryAsFavorite({
                id: original.id,
                isFavorite: !original.isFavorite,
              })
              toast.success(t("Category saved successfully"))
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

export { Actions as CategoryActions }
