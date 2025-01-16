"use client"

import { InvoiceSchemaT } from "@/db/(inv)/schema"
import { ColumnDef } from "@tanstack/react-table"
import { SortBtn } from "../buttons"

const columns: ColumnDef<InvoiceSchemaT>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortBtn text="Date" column={column} />,
  },
  {
    accessorKey: "total",
    header: ({ column }) => <SortBtn text="Total" column={column} />,
  },
]

export { columns as invoiceColumns }
