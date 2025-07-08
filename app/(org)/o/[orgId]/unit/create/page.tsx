import { FormActionBtns } from "@/components/buttons"
import { UnitForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { WithSubscription } from "@/components/wrapper"
import { createUnit } from "@/db/app/actions"
import { UnitFormProvider } from "@/providers"

type Props = {
  params: Promise<{ orgId: string }>
}

const Page = async (props: Props) => {
  const { orgId } = await props.params

  return (
    <WithSubscription orgId={orgId} unitId={null} entity="UNIT">
      <UnitFormProvider>
        <PageHeader
          title="New unit"
          className="mb-2"
          rightComp={<FormActionBtns formId="unit" />}
        />
        <UnitForm
          performAction={async (values) => {
            "use server"
            createUnit({ values, orgId })
          }}
        />
      </UnitFormProvider>
    </WithSubscription>
  )
}

export default Page
