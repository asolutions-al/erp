"use client"

import { Button } from "@/components/ui/button"
import { Command } from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

import { Label } from "@/components/ui/label"
import { Locale, locales } from "@/i18n"
import { setUserLocale } from "@/services/locale"
import { useLocale, useTranslations } from "next-intl"

export function AppearanceForm() {
  const t = useTranslations()
  const { setTheme, theme } = useTheme()
  const locale = useLocale() as Locale

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <Label>{t("Language")}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-[200px] justify-between",
                !locale && "text-muted-foreground"
              )}
            >
              {t(locale || "Select language")}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command onValueChange={(value) => {}}>
              <CommandInput placeholder="Search language..." />
              <CommandList>
                <CommandEmpty>{t("No language found")}.</CommandEmpty>
                <CommandGroup>
                  {locales.map((lang) => (
                    <CommandItem
                      value={lang}
                      key={lang}
                      onSelect={() => {
                        setUserLocale(lang)
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          lang === locale ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {t(lang)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="text-sm text-muted-foreground">
          {t("This is the language that will be used in the app")}
        </div>
      </div>

      <div className="space-y-1">
        <Label>{t("Theme")}</Label>
        <div className="text-sm text-muted-foreground">
          {t("Pick a theme that suits you best")}.
        </div>
        <RadioGroup
          onValueChange={(value) => {
            setTheme(value)
          }}
          defaultValue={theme}
          className="grid max-w-md grid-cols-2 gap-8 pt-2"
        >
          <div className="space-y-2">
            <Label className="[&:has([data-state=checked])>div]:border-primary">
              <RadioGroupItem value="light" className="sr-only" />
              <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                  <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                  </div>
                </div>
              </div>
              <span className="block w-full p-2 text-center font-normal">
                {t("Light")}
              </span>
            </Label>
          </div>
          <div className="space-y-2">
            <Label className="[&:has([data-state=checked])>div]:border-primary">
              <RadioGroupItem value="dark" className="sr-only" />
              <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                  <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                </div>
              </div>
              <span className="block w-full p-2 text-center font-normal">
                {t("Dark")}
              </span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
