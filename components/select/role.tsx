"use client"

import { FormControl } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mapOrgMemberRoleIcon } from "@/constants/maps"
import { role } from "@/orm/app/schema"
import { useTranslations } from "next-intl"

const list = role.enumValues.sort()
const iconMapper = mapOrgMemberRoleIcon

const RoleSelect = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  const t = useTranslations()
  return (
    <Select value={value} onValueChange={onChange}>
      <FormControl>
        <SelectTrigger aria-label={t("Select role")}>
          <SelectValue placeholder={t("Select role")} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {list.map((item) => {
          const Icon = iconMapper(item)
          return (
            <SelectItem key={item} value={item}>
              <span className="flex items-center gap-1">
                <Icon size={15} />
                {t(item)}
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

export { RoleSelect }
