"use client"

import { SortBtn } from "@/components/buttons"
import { ProductSchemaT } from "@/db/(inv)/schema"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import {
  CopyPlusIcon,
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

const Actions = ({ row }: CellContext<ProductSchemaT, unknown>) => {
  const t = useTranslations()
  const { unitId } = useParams()
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
        <Link href={`/${unitId}/product/update/${original.id}`} passHref>
          <DropdownMenuItem>
            <EditIcon />
            {t("Edit")}
          </DropdownMenuItem>
        </Link>
        <Link href={`/${unitId}/product/duplicate/${original.id}`} passHref>
          <DropdownMenuItem>
            <CopyPlusIcon />
            {t("Duplicate")}
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <TrashIcon />
          {t("Delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const columns: ColumnDef<ProductSchemaT>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortBtn text="Name" column={column} />,
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
    accessorKey: "status",
    header: ({ column }) => <SortBtn text="Status" column={column} />,
  },
  {
    id: "actions",
    cell: Actions,
  },
]

export { columns as productColumns }
