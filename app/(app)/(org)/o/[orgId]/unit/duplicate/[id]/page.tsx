import { UnitForm } from "@/components/forms"
import { PageContent, PageFormHeader } from "@/components/layout"
import { WithSubscription } from "@/components/wrapper"
import { createUnit } from "@/db/app/actions/unit"
import { db } from "@/db/app/instance"
import { unit } from "@/orm/app/schema"
import { UnitFormProvider } from "@/providers/form/unit"
import { and, eq } from "drizzle-orm"

type Props = { params: Promise<{ orgId: string; id: string }> }

const Page = async ({ params }: Props) => {
  const { orgId, id } = await params
  const data = await db.query.unit.findFirst({
    where: and(eq(unit.id, id), eq(unit.orgId, orgId)),
  })

  if (!data) return <div>Unit not found</div>

  return (
    <WithSubscription orgId={orgId} unitId={null} entity="UNIT">
      <UnitFormProvider defaultValues={data}>
        <PageFormHeader title="Duplicate" formId="unit" />
        <PageContent>
          <UnitForm
            performAction={async (values) => {
              "use server"
              await createUnit({ orgId, values })
            }}
          />
        </PageContent>
      </UnitFormProvider>
    </WithSubscription>
  )
}

export default Page
