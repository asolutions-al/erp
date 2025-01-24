"use client"

import { SortBtn } from "@/components/buttons"
import { OrgSchemaT } from "@/db/app/schema"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CellContext } from "@tanstack/react-table"
import { EditIcon, MoreHorizontalIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

const Actions = ({ row }: CellContext<OrgSchemaT, unknown>) => {
  const t = useTranslations()
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
        <Link href={`/org/${row.original.id}/settings`} passHref>
          <DropdownMenuItem>
            <EditIcon />
            {t("Manage")}
          </DropdownMenuItem>
        </Link>
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem>
          <TrashIcon />
          {t("Delete")}
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const columns: ColumnDef<OrgSchemaT>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortBtn text="Name" column={column} />,
  },
  {
    accessorKey: "description",
    header: ({ column }) => <SortBtn text="Description" column={column} />,
  },
  {
    id: "actions",
    cell: Actions,
  },
]

export { columns as orgColumns }
