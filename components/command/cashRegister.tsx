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
import { CashRegisterSchemaT } from "@/db/app/schema"
import { cn, formatNumber } from "@/lib/utils"
import {
  CheckCircleIcon,
  ChevronsUpDownIcon,
  PlusCircleIcon,
  WarehouseIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { Avatar, AvatarFallback } from "../ui/avatar"

const Empty = () => {
  const t = useTranslations()
  const { orgId, unitId } = useParams<GlobalParamsT>()
  return (
    <div className="flex flex-col items-center text-muted-foreground">
      <WarehouseIcon className="mb-4 h-12 w-12" />
      <p className="mb-4">{t("No cash registers found")}</p>
      <Link href={`/o/${orgId}/u/${unitId}/cashRegister/create`} passHref>
        <Button size="sm">
          <PlusCircleIcon />
          {t("Create new cash register")}
        </Button>
      </Link>
    </div>
  )
}

const CashRegisterCommand = ({
  list,
  value,
  onChange,
}: {
  list: CashRegisterSchemaT[]
  value: string
  onChange: (item: CashRegisterSchemaT) => void
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
          {value
            ? list.find((li) => li.id === value)?.name
            : `${t("Select cash register")}...`}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={t("Search cash register") + "..."} />
          <CommandList>
            <CommandEmpty>
              <Empty />
            </CommandEmpty>
            <CommandGroup>
              {list.map((item) => {
                const { id, name, balance } = item
                return (
                  <CommandItem
                    key={id}
                    value={name}
                    onSelect={() => {
                      onChange(item)
                      setPopOverOpen(false)
                    }}
                  >
                    <Avatar className="mr-2">
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{name}</span>
                      <span className="text-sm text-muted-foreground">
                        {t("Balance")}: {formatNumber(balance)}
                      </span>
                    </div>
                    <CheckCircleIcon
                      size={16}
                      className={cn(
                        "ml-auto",
                        value === id ? "opacity-100" : "opacity-0"
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

export { CashRegisterCommand }
