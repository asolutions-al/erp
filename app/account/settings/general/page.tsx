import { FormActionBtns } from "@/components/buttons"
import { UserForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { db } from "@/db/app/instance"
import { createAuthClient } from "@/db/auth/client"
import { orgMember, user } from "@/orm/app/schema"
import { UserFormProvider } from "@/providers/user-form"
import { eq } from "drizzle-orm"

type Props = {}

const Page = async (props: Props) => {
  const client = await createAuthClient()
  const {
    data: { user: clientUser },
  } = await client.auth.getUser()

  const userId = clientUser?.id

  if (!userId) return null

  const [userData, orgMemberList] = await Promise.all([
    db.query.user.findFirst({
      where: eq(user.id, userId),
    }),
    db.query.orgMember.findMany({
      where: eq(orgMember.userId, userId),
      with: { organization: true },
    }),
  ])

  const orgs = orgMemberList.map((orgMember) => orgMember.organization)

  return (
    <UserFormProvider defaultValues={userData}>
      <PageHeader
        title={"Account settings"}
        className="mb-2"
        renderRight={() => <FormActionBtns formId="user" />}
      />
      <UserForm
        orgs={orgs}
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
