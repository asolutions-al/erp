"use client"

import { CustomerActions } from "@/components/actions"
import { SortBtn } from "@/components/buttons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { customerImageBucket } from "@/contants/bucket"
import { publicStorageUrl } from "@/contants/consts"
import { CustomerSchemaT } from "@/db/app/schema"
import { ColumnDef } from "@tanstack/react-table"

type SchemaT = CustomerSchemaT

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
                src={`${publicStorageUrl}/${customerImageBucket}/${imageBucketPath}`}
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
    accessorKey: "idValue",
    header: ({ column }) => <SortBtn text="Id" column={column} />,
  },
  {
    accessorKey: "address",
    header: ({ column }) => <SortBtn text="Address" column={column} />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortBtn text="Email" column={column} />,
  },
  {
    id: "actions",
    cell: CustomerActions,
  },
]

export { columns as customerColumns }
