import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { db } from "@/db/app/instance"
import { createAuthClient } from "@/db/auth/client"
import { invitation } from "@/orm/app/schema"
import { and, eq } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { AcceptInvitationBtn } from "./accept-invitation-btn"
import { CreateAccountBtn } from "./create-account-btn"
import { DifferentAccountBtn } from "./different-account-btn"
import { NotFoundBtns } from "./not-found-btns"
import { RejectInvitationBtn } from "./reject-invitation-btn"
import { SignInBtn } from "./sign-in-btn"

type Props = {
  params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
  const t = await getTranslations()
  const { id } = await params

  const authClient = await createAuthClient()
  const {
    data: { user: authUser },
  } = await authClient.auth.getUser()

  const data = await db.query.invitation.findFirst({
    where: and(eq(invitation.id, id), eq(invitation.status, "PENDING")),
    with: {
      organization: true,
      user: true,
    },
  })

  if (!data) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="relative mx-auto mb-4 h-16 w-16">
              <Image
                src="/logo.png"
                alt="logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <CardTitle className="text-2xl text-destructive">
              {t("Invitation Not Found")}
            </CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              {t("We couldn't find this invitation")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
              <h3 className="mb-2 font-medium text-destructive">
                {t("This invitation link is no longer valid")}
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {t("The invitation may have expired")}</li>
                <li>
                  • {t("The invitation may have been canceled by the sender")}
                </li>
                <li>• {t("The invitation may have already been used")}</li>
                <li>• {t("The link may be corrupted or incomplete")}</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <h4 className="mb-2 font-medium">{t("What can you do?")}</h4>
                <p className="mb-4 text-sm text-muted-foreground">
                  {t(
                    "If you believe this is an error, please contact the person who sent you this invitation or try one of the options below"
                  )}
                </p>
              </div>
              <NotFoundBtns />
            </div>

            <div className="border-t pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                {t(
                  "Need help? Contact support or ask the person who invited you to send a new invitation"
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!authUser) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="relative mx-auto mb-4 h-16 w-16">
              <Image
                src="/logo.png"
                alt="logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <CardTitle className="text-2xl">
              {t("You have been invited to join")}
            </CardTitle>
            <CardDescription className="mt-2 text-lg font-medium text-foreground">
              {data.organization.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted-foreground">
              {t("You will need to sign in to accept this invitation")}
            </p>

            {/* <NeedSignInBtns /> */}
            <div className="space-y-1">
              <SignInBtn />
              <CreateAccountBtn />
            </div>

            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground">
                {t("This is a secure invitation from")} {data.organization.name}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (authUser.email !== data.email) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="relative mx-auto mb-4 h-16 w-16">
              <Image
                src="/logo.png"
                alt="logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <CardTitle className="text-2xl">
              {t("You have been invited to join")}
            </CardTitle>
            <CardDescription className="mt-2 text-lg font-medium text-foreground">
              {data.organization.name}
            </CardDescription>
            <div className="mt-2 text-sm text-muted-foreground">
              {t("Organization slug")}: {data.organization.id}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
              <p className="text-sm">
                {t("Your email address")}{" "}
                <span className="font-medium">{authUser.email}</span>{" "}
                {t(
                  "does not match the email address this invitation was sent to"
                )}
                .
              </p>
            </div>

            <p className="text-center text-muted-foreground">
              {t(
                "To accept this invitation, you will need to sign out and then sign in or create a new account using the same email address used in the invitation"
              )}
              .
            </p>

            <DifferentAccountBtn />

            <div className="border-t pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                {t("This invitation was sent to")}{" "}
                <span className="font-medium">{data.email}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="relative mx-auto mb-4 h-16 w-16">
            <Image
              src="/logo.png"
              alt="logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl">
            {t("You have been invited to join")}
          </CardTitle>
          <CardDescription className="mt-2 text-lg font-medium text-foreground">
            {data.organization.name}
          </CardDescription>
          <div className="mt-2 text-sm text-muted-foreground">
            {t("Organization slug")}: {data.organization.id}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 rounded-lg bg-muted/50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("Email")}:</span>
              <span className="font-medium">{data.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("Role")}:</span>
              <span className="font-medium">{t(data.role)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("Invited by")}:</span>
              <span className="font-medium">{data.user.email}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <AcceptInvitationBtn id={id} />
            <RejectInvitationBtn id={id} />
          </div>

          <div className="border-t pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              {t("This is a secure invitation from")} {data.organization.name}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
