import { FormActionBtns } from "@/components/buttons"
import { InvitationForm } from "@/components/forms"
import { PageHeader } from "@/components/layout/page-header"
import { createInvitation } from "@/db/app/actions"
import { InvitationFormProvider } from "@/providers"

type Props = {
  params: Promise<{ orgId: string }>
}

const Page = async ({ params }: Props) => {
  const { orgId } = await params

  return (
    <InvitationFormProvider>
      <PageHeader
        title="New member"
        className="mb-2"
        rightComp={<FormActionBtns formId="invitation" />}
      />
      <InvitationForm
        performAction={async (values) => {
          "use server"
          return await createInvitation({ values, orgId })
        }}
      />
    </InvitationFormProvider>
  )
}

export default Page
