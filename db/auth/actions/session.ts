"use server"

import { createAuthClient } from "@/db/auth/client"
import { getAuthRedirectUrl } from "@/lib/utils"
import { redirect } from "next/navigation"

const signOut = async () => {
  try {
    const client = await createAuthClient()
    await client.auth.signOut()

    redirect(getAuthRedirectUrl().toString())
  } catch (error) {
    console.error(error)
    throw error
  }
}

export { signOut }
