"use client"

import {
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { locales } from "@/i18n"
import { setUserLocale } from "@/services/locale"
import { LanguagesIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

const LanguageSwitcher = () => {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <LanguagesIcon />
        {t("Language")}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={locale}>
            {locales.map((lang) => (
              <DropdownMenuRadioItem
                value={lang}
                key={lang}
                onSelect={() => {
                  setUserLocale(lang)
                }}
              >
                {t(lang)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}

export { LanguageSwitcher }
