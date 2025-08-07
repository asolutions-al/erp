import { redirect } from "next/navigation"
import { createAuthClient } from "../client"

const getUserId = async () => {
  const authClient = await createAuthClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()
  if (!user) redirect("/")
  return user.id
}

export { getUserId }
