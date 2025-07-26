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

const generateInvitationEmailHTML = async ({
  orgName,
  acceptUrl,
  expiresAt,
  inviterEmail,
  inviterName,
}: InvitationEmailData): Promise<string> => {
  const t = await getTranslations()
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t("Invitation to join {orgName}", { orgName })}</title>
      <style>
          body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
          }
          .header { 
              background: #f8f9fa; 
              padding: 30px; 
              text-align: center; 
              border-radius: 8px; 
              margin-bottom: 30px; 
          }
          .content { 
              background: white; 
              padding: 30px; 
              border-radius: 8px; 
              border: 1px solid #e1e5e9; 
          }
          .button { 
              display: inline-block; 
              background: #007bff; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0; 
          }
          .footer { 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #e1e5e9; 
              font-size: 14px; 
              color: #6c757d; 
          }
      </style>
  </head>
  <body>
      <div class="header">
          <h1>${t("You're invited to join {orgName}", { orgName })}</h1>
      </div>
      
      <div class="content">
          <p>${t("Hello")},</p>
          
          <p>${t("{inviterName} has invited you to join {orgName}", {
            inviterName,
            orgName,
          })}</p>
          
          <p>${t("Click the button below to accept the invitation and join the organization")}:</p>
          
          <div style="text-align: center;">
              <a href="${acceptUrl}" class="button">
                  ${t("Accept Invitation")}
              </a>
          </div>
          
          <p><strong>${t("Important")}:</strong> ${t(
            "This invitation will expire on {date}",
            {
              date: new Date(expiresAt).toLocaleDateString(),
            }
          )}.</p>
          
          <p>${t("If you're having trouble clicking the button, copy and paste this link into your browser")}:</p>
          <p style="word-break: break-all; color: #007bff;">${acceptUrl}</p>
      </div>
      
      <div class="footer">
          <p>${t("This invitation was sent by {email}", {
            email: inviterEmail,
          })}</p>
      </div>
  </body>
  </html>
  `
}

const sendInvitationEmail = async (
  data: InvitationEmailData
): Promise<ResT<true>> => {
  const t = await getTranslations()
  const resend = new Resend(process.env.RESEND_API_KEY)

  const html = await generateInvitationEmailHTML(data)

  const res = await resend.emails.send({
    from: "noreply@asolutions.al",
    to: data.email,
    subject: t("You're invited to join {orgName}", {
      orgName: data.orgName,
    }),
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

export { sendInvitationEmail }
