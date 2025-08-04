"use client"

import { SupplierActions } from "@/components/actions"
import { SortBtn } from "@/components/buttons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BooleanFilter,
  SelectFilter,
  StringFilter,
} from "@/components/ui/data-table"
import { supplierImageBucket } from "@/constants/bucket"
import { EM_DASH, publicStorageUrl } from "@/constants/consts"
import { SupplierSchemaT } from "@/db/app/schema"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { FavoriteCell } from "../cell"

type SchemaT = SupplierSchemaT

const IdTypeCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.idType)
}

const columns: ColumnDef<SchemaT>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div>
        <SortBtn text="Name" column={column} />
        <StringFilter title="Name" column={column} />
      </div>
    ),
    cell: ({ row }) => {
      const { imageBucketPath, name } = row.original
      return (
        <div className="flex items-center gap-4">
          <Avatar>
            {imageBucketPath ? (
              <AvatarImage
                src={`${publicStorageUrl}/${supplierImageBucket}/${imageBucketPath}`}
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
    header: ({ column }) => (
      <div>
        <SortBtn text="Id" column={column} />
        <StringFilter title="Id" column={column} />
      </div>
    ),
  },
  {
    accessorKey: "idType",
    header: ({ column }) => (
      <div>
        <SortBtn text="Id type" column={column} />
        <SelectFilter title="Id type" column={column} />
      </div>
    ),
    filterFn: "equals",
    cell: IdTypeCell,
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <div>
        <SortBtn text="Address" column={column} />
        <StringFilter title="Address" column={column} />
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <div>
        <SortBtn text="Email" column={column} />
        <StringFilter title="Email" column={column} />
      </div>
    ),
    cell: ({ row }) => {
      const { email } = row.original
      if (!email) return EM_DASH

      return (
        <Link
          href={`mailto:${email}`}
          className="text-primary transition-colors hover:text-primary/80 hover:underline"
          title={`Send email to ${email}`}
        >
          {email}
        </Link>
      )
    },
  },
  {
    accessorKey: "isFavorite",
    header: ({ column }) => (
      <div>
        <SortBtn text="Favorite" column={column} />
        <BooleanFilter title="Favorite" column={column} />
      </div>
    ),
    cell: FavoriteCell,
  },
  {
    id: "actions",
    cell: SupplierActions,
  },
]

export { columns as supplierColumns }
