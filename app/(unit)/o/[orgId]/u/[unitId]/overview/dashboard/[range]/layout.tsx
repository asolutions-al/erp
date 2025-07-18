import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mapRangeIcon } from "@/contants/maps"
import { cn } from "@/lib/utils"
import { PlusCircleIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  params: Promise<{ orgId: string; unitId: string; range: RangeT }>
}>

const LIST: RangeT[] = ["today", "yesterday", "this_month"]

const Layout = async (props: Props) => {
  const { params } = props
  const { orgId, unitId, range: rangeParam } = await params
  const t = await getTranslations()

  return (
    <>
      <div className="mb-3 flex flex-row justify-between">
        <Tabs defaultValue={rangeParam}>
          <TabsList>
            {LIST.map((range) => {
              const Icon = mapRangeIcon(range)
              const isActive = range === rangeParam
              return (
                <Link
                  href={`/o/${orgId}/u/${unitId}/overview/dashboard/${range}`}
                  key={range}
                  passHref
                >
                  <TabsTrigger
                    value={range}
                    className="flex items-center gap-2"
                  >
                    <Icon size={20} />
                    <span
                      className={cn(
                        "sr-only sm:not-sr-only",
                        isActive && "not-sr-only"
                      )}
                    >
                      {t(range)}
                    </span>
                  </TabsTrigger>
                </Link>
              )
            })}
          </TabsList>
        </Tabs>
        <Link href={`/o/${orgId}/u/${unitId}/invoice/create`} passHref>
          <Button>
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
