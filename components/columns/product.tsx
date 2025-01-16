"use client"

import { SortBtn } from "@/components/buttons"
import { ProductSchemaT } from "@/db/(inv)/schema"
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<ProductSchemaT>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortBtn text="Name" column={column} />,
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
    accessorKey: "status",
    header: ({ column }) => <SortBtn text="Status" column={column} />,
  },
]

export { columns as productColumns }
