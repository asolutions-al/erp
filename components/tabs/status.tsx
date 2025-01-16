"use client"

import { status } from "@/orm/(inv)/schema"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

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
