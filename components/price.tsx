import { cn } from "@/lib/utils"
import { CurrencyT } from "@/types/enum"
import { useTranslations } from "next-intl"

const Price = ({
  price,
  currency,
  className,
}: {
  price: number
  currency: CurrencyT
  className?: string
}) => {
  const t = useTranslations()
  return (
    <div className={cn("flex gap-0.5", className)}>
      <p className="font-semibold">{price}</p>
      <p>{t(currency)}</p>
    </div>
  )
}

export { Price }
