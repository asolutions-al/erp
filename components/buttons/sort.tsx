import { Button } from "@/components/ui/button"
import { Column } from "@tanstack/react-table"
import { ArrowUpDownIcon } from "lucide-react"
import { Messages, useTranslations } from "next-intl"

export const SortBtn = ({
  text,
  column,
}: {
  text: keyof Messages
  column: Column<any>
}) => {
  const t = useTranslations()

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {t(text)}
      <ArrowUpDownIcon className="ml-2 h-4 w-4" />
    </Button>
  )
}
