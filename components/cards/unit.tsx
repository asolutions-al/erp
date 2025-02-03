import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import type { UnitSchemaT } from "@/db/app/schema"
import { BuildingIcon } from "lucide-react"

const UnitCard = ({ data }: { data: UnitSchemaT }) => {
  return (
    <Card>
      <div className="flex items-center gap-2 p-3.5">
        <div className="rounded-full bg-primary/10 p-2">
          <BuildingIcon />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold">{data.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {data.description}
          </CardDescription>
        </div>
      </div>
    </Card>
  )
}

export { UnitCard }
