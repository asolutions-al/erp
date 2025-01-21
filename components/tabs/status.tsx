"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { status } from "@/orm/app/schema"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"

const LIST = status.enumValues
const StatusTabs = ({
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
              query: { status: item },
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

export { StatusTabs }
