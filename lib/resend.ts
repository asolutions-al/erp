import { InvitationEmail, WelcomeEmail } from "@/components/emails"
import { render } from "@react-email/render"
import { getTranslations } from "next-intl/server"
import { Resend } from "resend"

type InvitationEmailData = {
  email: string
  orgName: string
  inviterName: string
  inviterEmail: string
  acceptUrl: string
  expiresAt: string
}

type WelcomeEmailData = {
  displayName: string
  email: string
  orgName: string
  loginUrl: string
}

const sendInvitationEmail = async (
  data: InvitationEmailData
): Promise<ResT<true>> => {
  const t = await getTranslations()
  const resend = new Resend(process.env.RESEND_API_KEY)

  const html = await render(await InvitationEmail(data))

  const res = await resend.emails.send({
    from: "noreply@asolutions.al",
    to: data.email,
    subject: t("New Invitation"),
    html,
  })

  if (res.error) {
    return {
      success: null,
      error: {
        message: res.error.message,
      },
    }
  }
  return {
    success: { data: true },
    error: null,
  }
}

const sendWelcomeEmail = async (
  data: WelcomeEmailData
): Promise<ResT<true>> => {
  const t = await getTranslations()
  const resend = new Resend(process.env.RESEND_API_KEY)

  const html = await render(await WelcomeEmail(data))

  const res = await resend.emails.send({
    from: "noreply@asolutions.al",
    to: data.email,
    subject: t("Welcome to {orgName}!", { orgName: data.orgName }),
    html,
  })

  if (res.error) {
    return {
      success: null,
      error: {
        message: res.error.message,
      },
    }
  }
  return {
    success: { data: true },
    error: null,
  }
}

export { sendInvitationEmail, sendWelcomeEmail }
