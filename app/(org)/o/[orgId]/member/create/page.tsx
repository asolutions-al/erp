import { InvitationForm } from "@/components/forms"
import { PageContent, PageFormHeader } from "@/components/layout"
import { createInvitation } from "@/db/app/actions"
import { InvitationFormProvider } from "@/providers"

type Props = {
  params: Promise<{ orgId: string }>
}

const Page = async ({ params }: Props) => {
  const { orgId } = await params

  return (
    <InvitationFormProvider>
      <PageFormHeader title="New member" formId="invitation" />
      <PageContent>
        <InvitationForm
          performAction={async (values) => {
            "use server"
            return await createInvitation({ values, orgId })
          }}
        />
      </PageContent>
    </InvitationFormProvider>
  )
}

export default Page
