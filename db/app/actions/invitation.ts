"use server"
import "server-only"

import { APP_URL } from "@/constants/env"
import { db } from "@/db/app/instance"
import { createAuthClient } from "@/db/auth/client"
import { sendInvitationEmail } from "@/lib/resend"
import { invitation, orgMember } from "@/orm/app/schema"
import { InvitationFormSchemaT } from "@/providers"
import { and, eq } from "drizzle-orm"
import { getTranslations } from "next-intl/server"

const createInvitation = async ({
  values,
  orgId,
}: {
  values: InvitationFormSchemaT
  orgId: string
}): Promise<ResT<{ invitationId: string }>> => {
  const t = await getTranslations()

  const authClient = await createAuthClient()
  const {
    data: { user: authUser },
  } = await authClient.auth.getUser()

  if (!authUser) {
    return {
      success: null,
      error: { message: t("Unauthorized") },
    }
  }

  const existingMember = await db.query.orgMember.findFirst({
    where: and(eq(orgMember.orgId, orgId)),
    with: {
      user: true,
    },
  })

  if (existingMember?.user.email === values.email) {
    return {
      success: null,
      error: { message: t("Email is already a member of this organization") },
    }
  }

  const existingInvitation = await db.query.invitation.findFirst({
    where: and(
      eq(invitation.email, values.email),
      eq(invitation.orgId, orgId),
      eq(invitation.status, "PENDING")
    ),
  })

  if (existingInvitation) {
    return {
      success: null,
      error: {
        message: t("An invitation has already been sent to this email"),
      },
    }
  }

  const [newInvitation] = await db
    .insert(invitation)
    .values({
      ...values,
      orgId,
      invitedBy: authUser.id,
      status: "PENDING",
    })
    .returning({ id: invitation.id })

  try {
    const newInvData = await db.query.invitation.findFirst({
      where: eq(invitation.id, newInvitation.id),
      with: {
        organization: true,
        user: true,
      },
    })

    if (newInvData)
      await sendInvitationEmail({
        email: newInvData.email,
        orgName: newInvData.organization.name,
        inviterName: newInvData.user.email,
        inviterEmail: newInvData.user.email,
        acceptUrl: `${APP_URL}/invitation/${newInvData.id}`,
        expiresAt: new Date().toISOString(),
      })
  } catch (error) {
    console.warn(error)
  }

  return {
    success: { data: { invitationId: newInvitation.id } },
    error: null,
  }
}

const acceptInvitation = async (id: string): Promise<ResT<true>> => {
  const t = await getTranslations()
  const authClient = await createAuthClient()
  const {
    data: { user: authUser },
  } = await authClient.auth.getUser()

  if (!authUser) {
    return {
      success: null,
      error: { message: t("You must be logged in to accept an invitation") },
    }
  }

  const userId = authUser.id

  const data = await db.query.invitation.findFirst({
    where: eq(invitation.id, id),
  })

  if (!data) {
    return {
      success: null,
      error: { message: t("Invitation not found") },
    }
  }

  const { status, email, orgId, role } = data

  if (status !== "PENDING") {
    return {
      success: null,
      error: {
        message: t("This invitation has been {status}", {
          status,
        }),
      },
    }
  }

  if (authUser.email !== email) {
    return {
      success: null,
      error: {
        message: t(
          "This invitation was sent to a different email address ({email})",
          {
            email,
          }
        ),
      },
    }
  }

  const existingMember = await db.query.orgMember.findFirst({
    where: and(eq(orgMember.orgId, orgId), eq(orgMember.userId, userId)),
  })

  if (existingMember) {
    return {
      error: {
        message: t("You are already a member of this organization"),
      },
      success: null,
    }
  }

  await db.transaction(async (tx) => {
    await tx.insert(orgMember).values({
      userId,
      orgId,
      role,
    })

    await tx
      .update(invitation)
      .set({ status: "ACCEPTED" })
      .where(eq(invitation.id, id))
  })

  return {
    success: { data: true },
    error: null,
  }
}

const rejectInvitation = async (id: string): Promise<ResT<true>> => {
  const t = await getTranslations()
  const authClient = await createAuthClient()
  const {
    data: { user: authUser },
  } = await authClient.auth.getUser()

  if (!authUser) {
    return {
      success: null,
      error: { message: t("You must be logged in to reject an invitation") },
    }
  }

  const data = await db.query.invitation.findFirst({
    where: eq(invitation.id, id),
  })

  if (!data) {
    return {
      success: null,
      error: { message: t("Invitation not found") },
    }
  }

  const { status, email } = data

  if (status !== "PENDING") {
    return {
      success: null,
      error: {
        message: t("This invitation has been {status}", {
          status,
        }),
      },
    }
  }

  if (authUser.email !== email) {
    return {
      success: null,
      error: {
        message: t(
          "This invitation was sent to a different email address ({email})",
          {
            email,
          }
        ),
      },
    }
  }

  await db
    .update(invitation)
    .set({ status: "REJECTED" })
    .where(eq(invitation.id, id))

  return {
    success: { data: true },
    error: null,
  }
}

export { acceptInvitation, createInvitation, rejectInvitation }
