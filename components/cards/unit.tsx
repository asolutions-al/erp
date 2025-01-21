import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UnitSchemaT } from "@/db/app/schema"

const UnitCard = ({ data }: { data: UnitSchemaT }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

export { UnitCard }
