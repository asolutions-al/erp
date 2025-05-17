"use client"

import { ProductActions } from "@/components/actions"
import { SortBtn } from "@/components/buttons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { productImagesBucket } from "@/contants/bucket"
import { publicStorageUrl } from "@/contants/consts"
import {
  CategorySchemaT,
  ProductCategorySchemaT,
  ProductInventorySchemaT,
  ProductSchemaT,
} from "@/db/app/schema"
import { formatNumber } from "@/lib/utils"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"
import { Badge } from "../ui/badge"

type SchemaT = ProductSchemaT & {
  productInventories: Pick<ProductInventorySchemaT, "stock">[]
  productCategories: (ProductCategorySchemaT & {
    category: CategorySchemaT
  })[]
}

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

const FavoriteCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const { original } = row
  const t = useTranslations()
  return original.isFavorite ? t("Yes") : t("No")
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
    accessorKey: "price",
    header: ({ column }) => <SortBtn text="Price" column={column} />,
    cell: ({ row }) => formatNumber(row.original.price),
  },
  {
    accessorKey: "taxType",
    header: ({ column }) => <SortBtn text="Tax" column={column} />,
    cell: TaxCell,
  },
  {
    id: "stock",
    accessorFn: (row) =>
      row.productInventories.reduce((acc, i) => acc + i.stock, 0),
    header: ({ column }) => <SortBtn text="Stock" column={column} />,
    cell: ({ getValue }) => formatNumber(getValue() as number),
  },
  {
    accessorKey: "barcode",
    header: ({ column }) => <SortBtn text="Barcode" column={column} />,
  },
  {
    accessorKey: "isFavorite",
    header: ({ column }) => <SortBtn text="Favorite" column={column} />,
    cell: FavoriteCell,
  },
  {
    size: 250,
    accessorKey: "productCategories",
    header: ({ column }) => <SortBtn text="Category" column={column} />,
    cell: ({ row }) => {
      const { original } = row
      return (
        <div className="flex flex-wrap gap-2">
          {original.productCategories.map((productCategory) => (
            <Badge key={productCategory.id} variant="outline">
              {productCategory.category.name}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ProductActions,
  },
]

export { columns as productColumns }
