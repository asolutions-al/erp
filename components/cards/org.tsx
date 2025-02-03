import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { OrgSchemaT } from "@/db/app/schema"
import { StoreIcon } from "lucide-react"

const OrgCard = ({ data }: { data: OrgSchemaT }) => {
  return (
    <Card>
      <div className="flex items-center gap-2 p-3.5">
        <div className="rounded-full bg-primary/10 p-2">
          <StoreIcon />
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

export { OrgCard }
