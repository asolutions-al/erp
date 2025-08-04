import { PageContent, PageListHeader } from "@/components/layout"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mapRangeIcon } from "@/constants/maps"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  params: Promise<{ orgId: string; unitId: string; period: PeriodT }>
}>

const LIST: PeriodT[] = [
  "today",
  // "yesterday",
  "this_week",
  // "last_week",
  "this_month",
  // "last_month",
]

const Layout = async (props: Props) => {
  const { params } = props
  const { orgId, unitId, period: rangeParam } = await params
  const t = await getTranslations()

  return (
    <>
      <PageListHeader
        title="Dashboard"
        button={{
          text: "New invoice",
          href: `/o/${orgId}/u/${unitId}/invoice/create`,
        }}
      />
      <PageContent>
        <Tabs defaultValue={rangeParam} className="pb-1.5">
          <TabsList>
            {LIST.map((period) => {
              const Icon = mapRangeIcon(period)
              const isActive = period === rangeParam
              return (
                <Link
                  href={`/o/${orgId}/u/${unitId}/overview/dashboard/${period}`}
                  key={period}
                  passHref
                >
                  <TabsTrigger
                    value={period}
                    className="flex items-center gap-2"
                  >
                    <Icon size={20} />
                    <span
                      className={cn(
                        "sr-only sm:not-sr-only",
                        isActive && "not-sr-only"
                      )}
                    >
                      {t(period)}
                    </span>
                  </TabsTrigger>
                </Link>
              )
            })}
          </TabsList>
        </Tabs>
        {props.children}
      </PageContent>
    </>
  )
}

export default Layout
