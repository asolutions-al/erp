"use client"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { productUnit } from "@/orm/app/schema"
import { ProductUnitT } from "@/types/enum"
import { CheckCircleIcon, ChevronsUpDownIcon, PackageIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Avatar, AvatarFallback } from "../ui/avatar"

const Empty = () => {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center text-muted-foreground">
      <PackageIcon className="mb-4 h-12 w-12" />
      <p className="mb-4">{t("Unit not found")}</p>
    </div>
  )
}

const list = productUnit.enumValues

const UnitCommand = ({
  value,
  onChange,
}: {
  value: ProductUnitT
  onChange: (value: string) => void
}) => {
  const t = useTranslations()
  const [popOverOpen, setPopOverOpen] = useState(false)

  return (
    <Popover open={popOverOpen} onOpenChange={setPopOverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={popOverOpen}
          className="w-full justify-between"
        >
          {value ? t(value) : `${t("Select unit")}...`}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={t("Search unit") + "..."} />
          <CommandList>
            <CommandEmpty>
              <Empty />
            </CommandEmpty>
            <CommandGroup>
              {list.map((item) => {
                return (
                  <CommandItem
                    key={item}
                    value={item}
                    onSelect={() => {
                      onChange(item)
                      setPopOverOpen(false)
                    }}
                  >
                    <Avatar className="mr-2">
                      <AvatarFallback>{t(item).charAt(0)}</AvatarFallback>
                    </Avatar>
                    {t(item)}
                    <CheckCircleIcon
                      size={16}
                      className={cn(
                        "ml-auto",
                        value === item ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { UnitCommand }
