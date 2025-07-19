"use client"

import { ProductActions } from "@/components/actions"
import { SortBtn } from "@/components/buttons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BooleanFilter,
  NumberFilter,
  SelectFilter,
  StringFilter,
} from "@/components/ui/data-table"
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

const UnitCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.unit)
}

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
        <SortBtn text="Price" column={column} />
        <NumberFilter title="Price" column={column} />
      </div>
    ),
    cell: ({ row }) => formatNumber(row.original.price),
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
