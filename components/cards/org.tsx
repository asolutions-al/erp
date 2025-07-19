import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { OrgSchemaT } from "@/db/app/schema"
import { BuildingIcon, StoreIcon, UsersIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

type Props = {
  data: OrgSchemaT & {
    unitCount: number
    memberCount: number
  }
}

const OrgCard = async ({ data }: Props) => {
  const t = await getTranslations()

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 transition-all group-hover:-right-16 group-hover:-top-16" />
      <div className="relative space-y-4 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <StoreIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{data.name}</CardTitle>
              <CardDescription>{data.description}</CardDescription>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BuildingIcon className="h-4 w-4" />
            <span>
              {t("Units")}: {data.unitCount || 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <UsersIcon className="h-4 w-4" />
            <span>
              {t("Members")}: {data.memberCount || 0}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export { OrgCard }
