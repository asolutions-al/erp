"use client"

import { InvoiceSchemaT } from "@/db/(inv)/schema"
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<InvoiceSchemaT>[] = [
  {
    accessorKey: "createdAt",
    header: "Name",
  },
  {
    accessorKey: "id",
    header: "Barcode",
  },
  {
    accessorKey: "unitId",
    header: "Price",
  },
]

export { columns as invoiceColumns }
