"use client"

import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { OrgSchemaT } from "@/db/app/schema"
import { CheckIcon, StoreIcon } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

type Props = {
  data: OrgSchemaT
}

const OrgSwitcherItem = (props: Props) => {
  const { data } = props
  const params = useParams<{ orgId: string }>()
  const pathname = usePathname()

  const isActive = data.id === params.orgId

  return (
    <Link
      href={{
        pathname: pathname.replace(params.orgId, data.id),
      }}
    >
      <DropdownMenuItem className="gap-2 p-2">
        <div className="flex size-6 items-center justify-center rounded-sm border">
          <StoreIcon />
        </div>
        {data.name}
        {isActive && (
          <DropdownMenuShortcut>
            <CheckIcon />
          </DropdownMenuShortcut>
        )}
      </DropdownMenuItem>
    </Link>
  )
}

export { OrgSwitcherItem }
