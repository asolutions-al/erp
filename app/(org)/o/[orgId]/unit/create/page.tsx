import { UnitForm } from "@/components/forms"
import { PageContent, PageFormHeader } from "@/components/layout"
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
        <PageFormHeader title="New unit" formId="unit" />
        <PageContent>
          <UnitForm
            performAction={async (values) => {
              "use server"
              createUnit({ values, orgId })
            }}
          />
        </PageContent>
      </UnitFormProvider>
    </WithSubscription>
  )
}

export default Page
