import { FormActionBtns } from "@/components/buttons"
import { CategoryForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createCategory } from "@/db/app/actions"
import { CategoryFormProvider } from "@/providers"

type Props = {
  params: Promise<GlobalParamsT>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId } = await params

  return (
    <CategoryFormProvider>
      <PageHeader
        title="Create category"
        className="mb-2"
        rightComp={<FormActionBtns formId="category" />}
      />
      <CategoryForm
        performAction={async (values) => {
          "use server"
          await createCategory({ values, orgId, unitId })
        }}
      />
    </CategoryFormProvider>
  )
}

export default Page
