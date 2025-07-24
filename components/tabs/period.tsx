"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mapRangeIcon } from "@/contants/maps"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

type PeriodT =
  | "today"
  | "yesterday"
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"

const LIST: PeriodT[] = [
  "today",
  // "yesterday",
  "this_week",
  // "last_week",
  "this_month",
  // "last_month",
]

const PeriodTabs = ({
  defaultValue,
}: {
  defaultValue: (typeof LIST)[number]
}) => {
  const t = useTranslations()
  const pathname = usePathname()
  const param = useSearchParams().get("period") || defaultValue

  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        {LIST.map((item) => {
          const Icon = mapRangeIcon(item)
          const isActive = item === param
          return (
            <Link
              key={item}
              href={{
                pathname,
                query: { period: item },
              }}
              passHref
            >
              <TabsTrigger value={item} className="flex items-center gap-2">
                <Icon size={20} />
                <span
                  className={cn(
                    "sr-only sm:not-sr-only",
                    isActive && "not-sr-only"
                  )}
                >
                  {t(item)}
                </span>
              </TabsTrigger>
            </Link>
          )
        })}
      </TabsList>
    </Tabs>
  )
}

export { PeriodTabs }
