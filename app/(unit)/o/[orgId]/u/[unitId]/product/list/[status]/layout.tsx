import { PageContent, PageListHeader } from "@/components/layout"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mapStatusIcon } from "@/constants/maps"
import { cn } from "@/lib/utils"
import { entityStatus } from "@/orm/app/schema"
import { EntityStatusT } from "@/types/enum"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  params: Promise<{ orgId: string; unitId: string; status: EntityStatusT }>
}>

const LIST = entityStatus.enumValues.sort()

const Layout = async (props: Props) => {
  const { params } = props
  const { orgId, unitId, status: statusParam } = await params
  const t = await getTranslations()

  return (
    <>
      <PageListHeader
        title="Products"
        button={{
          text: "New product",
          href: `/o/${orgId}/u/${unitId}/product/create`,
        }}
      />
      <PageContent>
        <Tabs defaultValue={statusParam} className="pb-1.5">
          <TabsList>
            {LIST.map((status) => {
              const Icon = mapStatusIcon(status)
              const isActive = status === statusParam
              return (
                <Link
                  href={`/o/${orgId}/u/${unitId}/product/list/${status}`}
                  key={status}
                  passHref
                >
                  <TabsTrigger
                    value={status}
                    className="flex items-center gap-2"
                  >
                    <Icon size={20} />
                    <span
                      className={cn(
                        "sr-only sm:not-sr-only",
                        isActive && "not-sr-only"
                      )}
                    >
                      {t(status)}
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
