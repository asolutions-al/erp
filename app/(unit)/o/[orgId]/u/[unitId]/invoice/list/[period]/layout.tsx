import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mapRangeIcon } from "@/constants/maps"
import { cn } from "@/lib/utils"
import { PlusCircleIcon } from "lucide-react"
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
      <div className="mb-3 flex flex-row justify-between">
        <Tabs defaultValue={rangeParam}>
          <TabsList>
            {LIST.map((period) => {
              const Icon = mapRangeIcon(period)
              const isActive = period === rangeParam
              return (
                <Link
                  href={`/o/${orgId}/u/${unitId}/invoice/list/${period}`}
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
        <Link href={`/o/${orgId}/u/${unitId}/invoice/create`} passHref>
          <Button size="sm">
            <PlusCircleIcon />
            <span className="sr-only sm:not-sr-only">{t("New invoice")}</span>
          </Button>
        </Link>
      </div>
      {props.children}
    </>
  )
}

export default Layout
