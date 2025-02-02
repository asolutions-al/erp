"use client"

import { SortBtn } from "@/components/buttons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { productImagesBucket } from "@/contants/bucket"
import { publicStorageUrl } from "@/contants/consts"
import { ProductSchemaT } from "@/db/app/schema"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { CopyPlusIcon, EditIcon, MoreHorizontalIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"

type SchemaT = ProductSchemaT

const StatusCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.status)
}
const UnitCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.unit)
}
const TaxCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.taxType)
}

const Actions = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { unitId, orgId } = useParams()
  const { original } = row
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <Link
          href={`/org/${orgId}/${unitId}/product/update/${original.id}`}
          passHref
        >
          <DropdownMenuItem>
            <EditIcon />
            {t("Edit")}
          </DropdownMenuItem>
        </Link>
        <Link
          href={`/org/${orgId}/${unitId}/product/duplicate/${original.id}`}
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

const columns: ColumnDef<SchemaT>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortBtn text="Name" column={column} />,
    cell: ({ row }) => {
      const { imageBucketPath, name } = row.original
      return (
        <div className="flex items-center gap-4">
          <Avatar>
            {imageBucketPath ? (
              <AvatarImage
                src={`${publicStorageUrl}/${productImagesBucket}/${imageBucketPath}`}
                alt={name}
              />
            ) : (
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          {name}
        </div>
      )
    },
  },
  {
    accessorKey: "unit",
    header: ({ column }) => <SortBtn text="Unit" column={column} />,
    cell: UnitCell,
  },
  {
    accessorKey: "barcode",
    header: ({ column }) => <SortBtn text="Barcode" column={column} />,
  },
  {
    accessorKey: "price",
    header: ({ column }) => <SortBtn text="Price" column={column} />,
  },
  {
    accessorKey: "taxType",
    header: ({ column }) => <SortBtn text="Tax" column={column} />,
    cell: TaxCell,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortBtn text="Status" column={column} />,
    cell: StatusCell,
  },
  {
    id: "actions",
    cell: Actions,
  },
]

export { columns as productColumns }
