import { FormActionBtns } from "@/components/buttons"
import { CategoryForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createCategory } from "@/db/app/actions"
import { db } from "@/db/app/instance"
import { category } from "@/orm/app/schema"
import { CategoryFormProvider } from "@/providers"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<GlobalParamsT & { id: string }>
}

const Page = async (props: Props) => {
  const { orgId, unitId, id } = await props.params

  const data = await db.query.category.findFirst({
    where: eq(category.id, id),
  })

  return (
    <CategoryFormProvider defaultValues={data}>
      <PageHeader
        title="Duplicate category"
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
