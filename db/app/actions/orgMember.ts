"use server"
import "server-only"

import { db } from "@/db/app/instance"
import { createAuthClient } from "@/db/auth/client"
import { orgMember } from "@/orm/app/schema"
import { and, eq } from "drizzle-orm"
import { getTranslations } from "next-intl/server"

const deleteOrgMember = async (id: string): Promise<ResT<true>> => {
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

  const memberToDelete = await db.query.orgMember.findFirst({
    where: eq(orgMember.id, id),
  })

  if (!memberToDelete) {
    return {
      success: null,
      error: { message: t("Member not found") },
    }
  }

  const { orgId, userId: memberUserId, role: memberRole } = memberToDelete

  // Get current user's role in the organization
  const currentUserMember = await db.query.orgMember.findFirst({
    where: and(eq(orgMember.orgId, orgId), eq(orgMember.userId, authUser.id)),
  })

  if (!currentUserMember) {
    return {
      success: null,
      error: { message: t("You don't have permission to perform this action") },
    }
  }

  // Permission checks:
  // 1. Owner can delete anyone except themselves
  // 2. Admin can delete members but not owners or other admins
  // 3. Members cannot delete anyone
  // 4. Cannot delete the last owner

  if (currentUserMember.role === "member") {
    return {
      success: null,
      error: { message: t("You don't have permission to remove members") },
    }
  }

  if (currentUserMember.role === "admin") {
    if (memberRole === "owner" || memberRole === "admin") {
      return {
        success: null,
        error: { message: t("You can only remove members") },
      }
    }
  }

  if (currentUserMember.role === "owner") {
    if (memberUserId === authUser.id) {
      return {
        success: null,
        error: {
          message: t("You cannot remove yourself from the organization"),
        },
      }
    }

    // Check if this is the last owner
    if (memberRole === "owner") {
      const ownerCount = await db.query.orgMember.findMany({
        where: and(eq(orgMember.orgId, orgId), eq(orgMember.role, "owner")),
      })

      if (ownerCount.length <= 1) {
        return {
          success: null,
          error: {
            message: t("Cannot remove the last owner from the organization"),
          },
        }
      }
    }
  }

  await db.delete(orgMember).where(eq(orgMember.id, id))

  return {
    success: { data: true },
    error: null,
  }
}

const updateOrgMemberRole = async ({
  id,
  role,
}: {
  id: string
  role: "owner" | "admin" | "member"
}): Promise<ResT<true>> => {
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

  const memberToUpdate = await db.query.orgMember.findFirst({
    where: eq(orgMember.id, id),
  })

  if (!memberToUpdate) {
    return {
      success: null,
      error: { message: t("Member not found") },
    }
  }

  const { orgId, userId: memberUserId, role: currentRole } = memberToUpdate

  // Get current user's role in the organization
  const currentUserMember = await db.query.orgMember.findFirst({
    where: and(eq(orgMember.orgId, orgId), eq(orgMember.userId, authUser.id)),
  })

  if (!currentUserMember) {
    return {
      success: null,
      error: { message: t("You don't have permission to perform this action") },
    }
  }

  // Permission checks:
  // 1. Only owners can change roles
  // 2. Cannot change your own role
  // 3. Cannot demote the last owner

  if (currentUserMember.role !== "owner") {
    return {
      success: null,
      error: { message: t("Only owners can change member roles") },
    }
  }

  if (memberUserId === authUser.id) {
    return {
      success: null,
      error: { message: t("You cannot change your own role") },
    }
  }

  // Check if trying to demote the last owner
  if (currentRole === "owner" && role !== "owner") {
    const ownerCount = await db.query.orgMember.findMany({
      where: and(eq(orgMember.orgId, orgId), eq(orgMember.role, "owner")),
    })

    if (ownerCount.length <= 1) {
      return {
        success: null,
        error: { message: t("Cannot demote the last owner") },
      }
    }
  }

  await db.update(orgMember).set({ role }).where(eq(orgMember.id, id))

  return {
    success: { data: true },
    error: null,
  }
}

export { deleteOrgMember, updateOrgMemberRole }
