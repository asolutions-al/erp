import { accountsUrl, appUrl } from "@/contants/consts"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getAuthRedirectUrl = () => {
  const url = new URL(accountsUrl)
  url.pathname = "/login"
  const redirectUrl = new URL(appUrl)
  redirectUrl.pathname = "/auth/callback"
  url.searchParams.set("redirectUrl", redirectUrl.href)
  return url
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
