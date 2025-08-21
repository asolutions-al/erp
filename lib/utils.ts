import { APP_URL, AUTH_URL } from "@/constants/env"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getAuthUrl = ({
  returnTo,
  page,
}: {
  returnTo: string
  page: "/login" | "/signup"
}) => {
  const url = new URL(AUTH_URL)
  url.pathname = page
  const redirectUrl = new URL(APP_URL)
  redirectUrl.pathname = returnTo
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

export const canEdit = (role: GlobalTableMetaT["role"]) =>
  role === "owner" || role === "admin"
export const canDelete = (role: GlobalTableMetaT["role"]) => role === "owner"
