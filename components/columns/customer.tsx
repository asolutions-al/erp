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
import { customerImageBucket } from "@/contants/bucket"
import { publicStorageUrl } from "@/contants/consts"
import { CustomerSchemaT } from "@/db/app/schema"
import { CellContext, ColumnDef } from "@tanstack/react-table"
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
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
                src={`${publicStorageUrl}/${customerImageBucket}/${imageBucketPath}`}
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
    accessorKey: "idValue",
    header: ({ column }) => <SortBtn text="Id" column={column} />,
  },
  {
    accessorKey: "address",
    header: ({ column }) => <SortBtn text="Address" column={column} />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortBtn text="Email" column={column} />,
  },
  {
    id: "actions",
    cell: Actions,
  },
]

export { columns as customerColumns }
