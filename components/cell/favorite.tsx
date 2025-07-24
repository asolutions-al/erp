"use client"

import { CellContext } from "@tanstack/react-table"
import { StarIcon, StarOffIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "../ui/badge"

const FavoriteCell = <
  T extends {
    isFavorite: boolean
  },
>({
  row,
}: CellContext<T, unknown>) => {
  const { original } = row
  const t = useTranslations()
  const Icon = original.isFavorite ? StarIcon : StarOffIcon

  return (
    <Badge variant="outline">
      <Icon className="mr-1" size={15} />
      {original.isFavorite ? t("Yes") : t("No")}
    </Badge>
  )
}

export { FavoriteCell }
