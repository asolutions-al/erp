import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mapStatusIcon } from "@/contants/maps"
import { cn } from "@/lib/utils"
import { status } from "@/orm/app/schema"
import { StatusT } from "@/types/enum"
import { PlusCircleIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  params: Promise<{ orgId: string; unitId: string; status: StatusT }>
}>

const LIST = status.enumValues.sort()

const Layout = async (props: Props) => {
  const { params } = props
  const { orgId, unitId, status: statusParam } = await params
  const t = await getTranslations()

  return (
    <>
      <div className="mb-3 flex flex-row justify-between">
        <Tabs defaultValue={statusParam}>
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
        <Link href={`/o/${orgId}/u/${unitId}/product/create`} passHref>
          <Button>
            <PlusCircleIcon />
            <span className="sr-only sm:not-sr-only">{t("New product")}</span>
          </Button>
        </Link>
      </div>
      {props.children}
    </>
  )
}

export default Layout
