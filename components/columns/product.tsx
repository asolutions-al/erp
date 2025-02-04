"use client"

import { ProductActions } from "@/components/actions"
import { SortBtn } from "@/components/buttons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { productImagesBucket } from "@/contants/bucket"
import { publicStorageUrl } from "@/contants/consts"
import { ProductSchemaT } from "@/db/app/schema"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

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
    cell: ProductActions,
  },
]

export { columns as productColumns }
