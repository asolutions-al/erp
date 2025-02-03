import { getRequestConfig } from "next-intl/server"
import { getUserLocale } from "./services/locale"

export type Locale = (typeof locales)[number]

export const locales = ["en", "al"] as const
export const defaultLocale: Locale = "en"

export default getRequestConfig(async () => {
  const locale = await getUserLocale() //TODO: Breaks ppr, find alternative

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
