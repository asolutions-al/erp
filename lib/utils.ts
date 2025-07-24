import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getAuthRedirectUrl = () => {
  const url = new URL(process.env.ACCOUNTS_URL!)
  url.pathname = "/login"
  const redirectUrl = new URL(process.env.APP_URL!)
  redirectUrl.pathname = "/auth/callback"
  url.searchParams.set("redirectUrl", redirectUrl.href)
  return url
}

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "numeric",
    hourCycle: "h23",
  }).format(date)

export const formatNumber = (num: number) =>
  new Intl.NumberFormat("en-US").format(num)
