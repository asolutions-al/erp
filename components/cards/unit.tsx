import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import type { UnitSchemaT } from "@/db/app/schema"
import { BuildingIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

const UnitCard = async ({ data }: { data: UnitSchemaT }) => {
  const t = await getTranslations()

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 transition-all group-hover:-right-16 group-hover:-top-16" />
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <BuildingIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{data.name}</CardTitle>
            <CardDescription>{data.description}</CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { UnitCard }
