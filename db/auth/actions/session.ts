"use server"

import { createAuthClient } from "@/db/auth/client"
import { getAuthUrl } from "@/lib/utils"
import { redirect } from "next/navigation"

const signOut = async () => {
  try {
    const client = await createAuthClient()
    await client.auth.signOut()

    redirect(getAuthUrl())
  } catch (error) {
    console.error(error)
    throw error
  }
}

export { signOut }
