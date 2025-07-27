"use client"

import { mapOrgMemberRoleIcon } from "@/constants/maps"
import { OrgMemberRoleT } from "@/types/enum"
import { CellContext } from "@tanstack/react-table"
import { useTranslations } from "next-intl"
import { Badge } from "../ui/badge"

const RoleCell = <
  T extends {
    role: OrgMemberRoleT
  },
>({
  row,
}: CellContext<T, unknown>) => {
  const { original } = row
  const t = useTranslations()
  const Icon = mapOrgMemberRoleIcon(original.role)

  return (
    <Badge variant="outline">
      <Icon className="mr-1" size={15} />
      {t(original.role)}
    </Badge>
  )
}

export { RoleCell }
