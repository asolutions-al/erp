import { FormActionBtns } from "@/components/buttons"
import { UnitForm } from "@/components/forms/unit"
import { PageHeader } from "@/components/layout/page-header"
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
    <UnitFormProvider defaultValues={data}>
      <PageHeader
        title="Duplicate"
        className="mb-2"
        rightComp={<FormActionBtns formId="unit" />}
      />
      <UnitForm
        performAction={async (values) => {
          "use server"
          await createUnit({ orgId, values })
        }}
      />
    </UnitFormProvider>
  )
}

export default Page
