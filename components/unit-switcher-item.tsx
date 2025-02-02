"use client"

import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { UnitSchemaT } from "@/db/app/schema"
import { BuildingIcon, CheckIcon } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

type Props = {
  data: UnitSchemaT
}

const UnitSwitcherItem = (props: Props) => {
  const { data } = props
  const params = useParams<{ unitId: string }>()
  const pathname = usePathname()

  const isActive = data.id === params.unitId

  return (
    <Link
      href={{
        pathname: pathname.replace(params.unitId, data.id),
      }}
    >
      <DropdownMenuItem className="gap-2 p-2">
        <div className="flex size-6 items-center justify-center rounded-sm border">
          <BuildingIcon />
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

export { UnitSwitcherItem }
