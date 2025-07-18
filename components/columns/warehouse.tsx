"use client"

import { WarehouseActions } from "@/components/actions"
import { SortBtn } from "@/components/buttons"
import {
  ProductInventorySchemaT,
  ProductSchemaT,
  WarehouseSchemaT,
} from "@/db/app/schema"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

type SchemaT = WarehouseSchemaT & {
  productInventories: (Pick<ProductInventorySchemaT, "stock"> & {
    product: Pick<ProductSchemaT, "status">
  })[]
}

const StatusCell = ({ row }: CellContext<SchemaT, unknown>) => {
  const t = useTranslations()
  const { original } = row
  return t(original.status)
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
  },
  {
    accessorFn: (row) =>
      row.productInventories
        // TODO: should be filterd on the server
        .filter((item) => item.product.status === "active")
        .reduce((acc, item) => acc + item.stock, 0),
    id: "stock",
    header: ({ column }) => <SortBtn text="Stock" column={column} />,
  },
  {
    accessorKey: "city",
    header: ({ column }) => <SortBtn text="City" column={column} />,
  },
  {
    accessorKey: "address",
    header: ({ column }) => <SortBtn text="Address" column={column} />,
  },
  {
    accessorKey: "isFavorite",
    header: ({ column }) => <SortBtn text="Favorite" column={column} />,
    cell: FavoriteCell,
  },
  {
    id: "actions",
    cell: WarehouseActions,
  },
]

export { columns as warehouseColumns }
