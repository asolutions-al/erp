import { Button } from "@/components/ui/button"
import { Column, RowData, SortDirection } from "@tanstack/react-table"
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react"
import { Messages, useTranslations } from "next-intl"

const ICON_MAP: Record<SortDirection, React.ComponentType> = {
  asc: ArrowUpIcon,
  desc: ArrowDownIcon,
}

export const SortBtn = <TData extends RowData>({
  text,
  column,
}: {
  text: keyof Messages
  column: Column<TData>
}) => {
  const t = useTranslations()

  const isSorted = column.getIsSorted()

  const Icon = isSorted ? ICON_MAP[isSorted] : ArrowUpDownIcon

  return (
    <Button variant="ghost" onClick={() => column.toggleSorting()}>
      {t(text)}
      <Icon className="ml-2 h-4 w-4" />
    </Button>
  )
}
