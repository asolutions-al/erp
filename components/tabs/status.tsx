"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mapStatusIcon } from "@/constants/maps"
import { cn } from "@/lib/utils"
import { entityStatus } from "@/orm/app/schema"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const LIST = entityStatus.enumValues.sort()

const StatusTabs = ({
  defaultValue,
}: {
  defaultValue: (typeof LIST)[number]
}) => {
  const t = useTranslations()
  const pathname = usePathname()
  const param = useSearchParams().get("period") || defaultValue
  const router = useRouter()

  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        {LIST.map((item) => {
          const Icon = mapStatusIcon(item)
          const isActive = item === param
          return (
            <TabsTrigger
              value={item}
              className="flex items-center gap-2"
              onClick={() => {
                router.push(`${pathname}?status=${item}`)
              }}
              key={item}
            >
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
          )
        })}
      </TabsList>
    </Tabs>
  )
}

export { StatusTabs }
