"use client"

import {
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { SunMoonIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"

const ThemeSwitcher = () => {
  const t = useTranslations()
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <SunMoonIcon />
        Theme
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
            <DropdownMenuRadioItem value="light">
              {t("Light")}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              {t("Dark")}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              {t("System")}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}

export { ThemeSwitcher }
