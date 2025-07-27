"use client"

import { ProductActions } from "@/components/actions"
import { SortBtn } from "@/components/buttons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BooleanFilter,
  MultiSelectFilter,
  NumberFilter,
  SelectFilter,
  StringFilter,
} from "@/components/ui/data-table"
import { productImagesBucket } from "@/constants/bucket"
import { publicStorageUrl } from "@/constants/consts"
import {
  CategorySchemaT,
  ProductCategorySchemaT,
  ProductInventorySchemaT,
  ProductSchemaT,
} from "@/db/app/schema"
import { formatNumber } from "@/lib/utils"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"
import { FavoriteCell } from "../cell"
import { Badge } from "../ui/badge"

type SchemaT = ProductSchemaT & {
  productInventories: Pick<ProductInventorySchemaT, "stock">[]
  productCategories: (ProductCategorySchemaT & {
    category: CategorySchemaT
  })[]
}

const UnitCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.unit)
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
    header: ({ column }) => (
      <div>
        <SortBtn text="Unit" column={column} />
        <SelectFilter title="Unit" column={column} />
      </div>
    ),
    cell: UnitCell,
    filterFn: "equals",
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <div>
        <SortBtn text="Selling Price" column={column} />
        <NumberFilter title="Selling Price" column={column} />
      </div>
    ),
    cell: ({ row }) => formatNumber(row.original.price),
    filterFn: "numberRangeFilter",
  },
  {
    accessorKey: "purchasePrice",
    header: ({ column }) => (
      <div>
        <SortBtn text="Purchase Price" column={column} />
        <NumberFilter title="Purchase Price" column={column} />
      </div>
    ),
    cell: ({ row }) => formatNumber(row.original.purchasePrice),
    filterFn: "numberRangeFilter",
  },
  {
    accessorKey: "taxPercentage",
    header: ({ column }) => (
      <div>
        <SortBtn text="Tax" column={column} />
        <NumberFilter title="Tax %" column={column} />
      </div>
    ),
    cell: ({ row }) => formatNumber(row.original.taxPercentage) + "%",
    filterFn: "numberRangeFilter",
  },
  {
    id: "stock",
    accessorFn: (row) =>
      row.productInventories.reduce((acc, i) => acc + i.stock, 0),
    header: ({ column }) => (
      <div>
        <SortBtn text="Stock" column={column} />
        <NumberFilter title="Stock" column={column} />
      </div>
    ),
    cell: ({ getValue }) => formatNumber(getValue() as number),
    filterFn: "numberRangeFilter",
  },
  {
    accessorKey: "barcode",
    header: ({ column }) => (
      <div>
        <SortBtn text="Barcode" column={column} />
        <StringFilter title="Barcode" column={column} />
      </div>
    ),
  },

  {
    id: "categories",
    size: 250,
    accessorFn: (row) =>
      row.productCategories.map((pc) => pc.category.name).join(", "),
    header: ({ column }) => (
      <div>
        <SortBtn text="Category" column={column} />
        <MultiSelectFilter title="Category" column={column} />
      </div>
    ),
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
    filterFn: "multiSelectFilter",
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
    cell: ProductActions,
  },
]

export { columns as productColumns }
