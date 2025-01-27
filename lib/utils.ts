import { accountsUrl, appUrl } from "@/contants/consts"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// TODO: remove this function, seems pointless
export const getAuthUrl = (args?: { searchParams?: URLSearchParams }) => {
  const { searchParams } = args || {}

  const url = new URL(accountsUrl)
  url.pathname = "/login"
  const redirectUrl = new URL(appUrl)
  redirectUrl.pathname = "/auth/callback"

  /**
   * Append all searchParams to redirectUrl
   * so that, we don't lose track of the original url
   */
  if (searchParams) redirectUrl.search = searchParams.toString()

  /**
   * Append redirectUrl to accounts url
   * so that, after login, we redirect to the original page
   */
  url.searchParams.set("redirectUrl", redirectUrl.href)

  return url.toString()
}

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "numeric",
    hourCycle: "h23",
  }).format(date)
}
