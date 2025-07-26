"use server"
import "server-only"

import { createAuthClient } from "@/db/auth/client"
import { getAuthUrl } from "@/lib/utils"
import { redirect } from "next/navigation"

const signOut = async ({
  returnTo,
  page,
}: {
  returnTo: string
  page: "/login" | "/signup"
}) => {
  const client = await createAuthClient()
  await client.auth.signOut()

  redirect(getAuthUrl({ page, returnTo }).toString())
}

export { signOut }
