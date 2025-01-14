"use client"

import { ProductSchemaT } from "@/db/(inv)/schema"
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<ProductSchemaT>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "barcode",
    header: "Barcode",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]

export { columns as productColumns }
