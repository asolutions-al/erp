"use client"

import { CustomerActions } from "@/components/actions"
import { SortBtn } from "@/components/buttons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BooleanFilter,
  SelectFilter,
  StringFilter,
} from "@/components/ui/data-table"
import { customerImageBucket } from "@/contants/bucket"
import { publicStorageUrl } from "@/contants/consts"
import { CustomerSchemaT } from "@/db/app/schema"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

type SchemaT = CustomerSchemaT

const FavoriteCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const t = useTranslations()
  return original.isFavorite ? t("Yes") : t("No")
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
    cell: CustomerActions,
  },
]

export { columns as customerColumns }
