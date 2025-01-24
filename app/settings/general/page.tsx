import { FormActionBtns } from "@/components/buttons"
import { UserForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { db } from "@/db/app/instance"
import { createAuthClient } from "@/db/auth/client"
import { user } from "@/orm/app/schema"
import { UserFormProvider } from "@/providers/user-form"
import { eq } from "drizzle-orm"

type Props = {}

const Page = async (props: Props) => {
  const client = await createAuthClient()
  const { data } = await client.auth.getUser()
  const userId = data.user?.id

  if (!userId) return null

  const { displayName } =
    (await db.query.user.findFirst({
      where: eq(user.id, userId),
    })) || {}

  return (
    <UserFormProvider defaultValues={{ displayName }}>
      <PageHeader
        title={"Account settings"}
        className="mb-2"
        renderRight={() => <FormActionBtns formId="user" />}
      />
      <UserForm
        performAction={async (values) => {
          "use server"

          await db
            .update(user)
            .set({
              displayName: values.displayName,
            })
            .where(eq(user.id, userId))
        }}
      />
    </UserFormProvider>
  )
}

export default Page
