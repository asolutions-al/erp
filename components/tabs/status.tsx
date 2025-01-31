"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mapStatusIcon } from "@/contants/maps"
import { cn } from "@/lib/utils"
import { status } from "@/orm/app/schema"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

const LIST = status.enumValues.sort()

const StatusTabs = ({
  defaultValue,
}: {
  defaultValue: (typeof LIST)[number]
}) => {
  const t = useTranslations()
  const pathname = usePathname()
  const param = useSearchParams().get("range") || defaultValue

  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        {LIST.map((item) => {
          const Icon = mapStatusIcon(item)
          const isActive = item === param
          return (
            <Link
              key={item}
              href={{
                pathname,
                query: { status: item },
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

export { StatusTabs }
