import { getRequestConfig } from "next-intl/server"

export type Locale = (typeof locales)[number]

export const locales = ["en", "al"] as const
export const defaultLocale: Locale = "en"

export default getRequestConfig(async () => {
  // const locale = await getUserLocale() //TODO: remove the hardcoded locale
  const locale = defaultLocale

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
