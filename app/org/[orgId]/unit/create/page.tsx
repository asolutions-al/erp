import { FormActionBtns } from "@/components/buttons"
import { UnitForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createUnit } from "@/db/(inv)/actions"
import { UnitFormProvider } from "@/providers/unit-form"

type Props = {
  params: Promise<{ orgId: string }>
}

const Page = async (props: Props) => {
  const { orgId } = await props.params
  return (
    <UnitFormProvider>
      <PageHeader
        title={"New unit"}
        className="my-2"
        renderRight={() => <FormActionBtns formId="unit" />}
      />
      <UnitForm
        performAction={async (values) => {
          "use server"
          createUnit({ values, orgId })
        }}
      />
    </UnitFormProvider>
  )
}

export default Page
