"use server"
import "server-only"

import { createAuthClient } from "@/db/auth/client"
import { getAuthRedirectUrl } from "@/lib/utils"
import { redirect } from "next/navigation"

const signOut = async ({ pathname }: { pathname: "/login" | "/signup" }) => {
  try {
    const client = await createAuthClient()
    await client.auth.signOut()

    redirect(getAuthRedirectUrl({ pathname }).toString())
  } catch (error) {
    console.error(error)
    throw error
  }
}

export { signOut }
