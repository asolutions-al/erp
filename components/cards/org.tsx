import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { OrgSchemaT } from "@/db/(inv)/schema"

const OrgCard = ({ data }: { data: OrgSchemaT }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

export { OrgCard }
