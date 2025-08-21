import { CategoryForm } from "@/components/forms"
import { PageContent, PageFormHeader } from "@/components/layout"
import { updateCategory } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { category } from "@/orm/app/schema"
import { CategoryFormProvider } from "@/providers"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParamsT & { id: string }>
}

const Page = async (props: Props) => {
  const { id } = await props.params

  const data = await db.query.category.findFirst({
    where: eq(category.id, id),
  })

  return (
    <CategoryFormProvider defaultValues={data}>
      <PageFormHeader title="Update category" formId="category" />
      <PageContent>
        <CategoryForm
          performAction={async (values) => {
            "use server"
            await updateCategory({ values, id })
          }}
        />
      </PageContent>
    </CategoryFormProvider>
  )
}

export default Page
