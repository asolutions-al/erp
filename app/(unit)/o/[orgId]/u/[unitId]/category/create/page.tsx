import { CategoryForm } from "@/components/forms"
import { PageContent, PageFormHeader } from "@/components/layout"
import { createCategory } from "@/db/app/actions"
import { CategoryFormProvider } from "@/providers"

type Props = {
  params: Promise<GlobalParamsT>
}

const Page = async ({ params }: Props) => {
  const { orgId, unitId } = await params

  return (
    <CategoryFormProvider>
      <PageFormHeader title="Create category" formId="category" />
      <PageContent>
        <CategoryForm
          performAction={async (values) => {
            "use server"
            await createCategory({ values, orgId, unitId })
          }}
        />
      </PageContent>
    </CategoryFormProvider>
  )
}

export default Page
