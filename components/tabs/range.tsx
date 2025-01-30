"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"

type RangeT =
  | "today"
  | "yesterday"
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"

const LIST: RangeT[] = [
  "today",
  "yesterday",
  // "this_week",
  // "last_week",
  "this_month",
  // "last_month",
]

const RangeTabs = ({
  defaultValue,
}: {
  defaultValue: (typeof LIST)[number]
}) => {
  const t = useTranslations()
  const pathname = usePathname()
  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        {LIST.map((item) => (
          <Link
            key={item}
            href={{
              pathname,
              query: { range: item },
            }}
            passHref
          >
            <TabsTrigger value={item}>{t(item)}</TabsTrigger>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  )
}

export { RangeTabs }
