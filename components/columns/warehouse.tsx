"use client"

import { WarehouseActions } from "@/components/actions"
import { SortBtn } from "@/components/buttons"
import {
  BooleanFilter,
  NumberFilter,
  StringFilter,
} from "@/components/ui/data-table"
import {
  ProductInventorySchemaT,
  ProductSchemaT,
  WarehouseSchemaT,
} from "@/db/app/schema"
import { ColumnDef } from "@tanstack/react-table"
import { FavoriteCell } from "../cell"

type SchemaT = WarehouseSchemaT & {
  productInventories: (Pick<ProductInventorySchemaT, "stock"> & {
    product: Pick<ProductSchemaT, "status">
  })[]
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
  },
  {
    accessorFn: (row) =>
      row.productInventories
        // TODO: should be filterd on the server
        .filter((item) => item.product.status === "active")
        .reduce((acc, item) => acc + item.stock, 0),
    id: "stock",
    header: ({ column }) => (
      <div>
        <SortBtn text="Stock" column={column} />
        <NumberFilter title="Stock" column={column} />
      </div>
    ),
    filterFn: "numberRangeFilter",
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
      <div>
        <SortBtn text="City" column={column} />
        <StringFilter title="City" column={column} />
      </div>
    ),
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
    cell: WarehouseActions,
  },
]

export { columns as warehouseColumns }
