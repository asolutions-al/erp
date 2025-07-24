import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatNumber } from "@/lib/utils"
import { TrendingDownIcon, TrendingUpDown, TrendingUpIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

const GrowthCard = async ({
  Icon,
  title,
  description,
  suggestion,
  growth,
  range,
}: {
  Icon: React.ElementType
  title: string
  description: string
  suggestion: string
  growth: GrowthT
  range: RangeT
}) => {
  const t = await getTranslations()
  const { diffPercent, status, diff } = growth

  const sign = { equal: "", up: "+", down: "-" }[status]

  const TrendIcon = {
    equal: TrendingUpDown,
    up: TrendingUpIcon,
    down: TrendingDownIcon,
  }[status]

  const message = {
    equal: t("Same as {range}", {
      range,
    }),
    up: t("{diff} more than {range}", {
      diff: formatNumber(Math.abs(diff)),
      range,
    }),
    down: t("{diff} less than {range}", {
      diff: formatNumber(Math.abs(diff)),
      range,
    }),
  }[status]

  return (
    <Card>
      <CardHeader className="relative flex flex-row items-center gap-4 pb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-sm">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <CardDescription className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {description}
          </CardDescription>
          <CardTitle className="text-xl font-bold text-foreground">
            {title}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge
              variant="outline"
              className={`flex gap-1 rounded-lg border-0 px-2 py-1 text-xs ${
                status === "up"
                  ? "bg-green-100 text-green-700"
                  : status === "down"
                    ? "bg-red-100 text-red-700"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <TrendIcon className="size-3" />
              {sign}
              {formatNumber(Math.abs(diffPercent))}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 p-4 pt-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          {message}
          <TrendIcon className="size-4" />
        </div>
        <div className="text-xs text-muted-foreground">{suggestion}</div>
      </CardFooter>
    </Card>
  )
}

export { GrowthCard }
