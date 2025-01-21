import { FormActionBtns } from "@/components/buttons"
import { UnitForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { UnitFormProvider } from "@/providers/unit-form"

type Props = {}

const Page = async (props: Props) => {
  return (
    <UnitFormProvider>
      <PageHeader
        title={"Create unit"}
        className="my-2"
        renderRight={() => <FormActionBtns formId="unit" />}
      />
      <UnitForm
        performAction={async (values) => {
          "use server"
          console.log("values", values)
          // TODO: create but orgId is necessary
        }}
      />
    </UnitFormProvider>
  )
}

export default Page
