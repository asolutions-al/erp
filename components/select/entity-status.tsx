"use client"

import { FormControl } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mapStatusIcon } from "@/contants/maps"
import { entityStatus } from "@/orm/app/schema"
import { useTranslations } from "next-intl"

const list = entityStatus.enumValues.sort()
const iconMapper = mapStatusIcon

const EntityStatusSelect = ({
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
        <SelectTrigger aria-label={t("Select status")}>
          <SelectValue placeholder={t("Select status")} />
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

export { EntityStatusSelect }
