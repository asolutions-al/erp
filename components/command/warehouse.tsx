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
import { WarehouseSchemaT } from "@/db/app/schema"
import { cn } from "@/lib/utils"
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

const Empty = () => {
  const t = useTranslations()
  const { orgId, unitId } = useParams<GlobalParamsT>()
  return (
    <div className="flex flex-col items-center text-muted-foreground">
      <WarehouseIcon className="mb-4 h-12 w-12" />
      <p className="mb-4">{t("Warehouse not found")}</p>
      <Link href={`/o/${orgId}/u/${unitId}/warehouse/create`} passHref>
        <Button>
          <PlusCircleIcon />
          {t("Create new warehouse")}
        </Button>
      </Link>
    </div>
  )
}

const WarehouseCommand = ({
  list,
  value,
  onChange,
}: {
  list: WarehouseSchemaT[]
  value: string
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
          {value
            ? list.find((li) => li.id === value)?.name
            : `${t("Select warehouse")}...`}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={t("Search warehouse") + "..."} />
          <CommandList>
            <CommandEmpty>
              <Empty />
            </CommandEmpty>
            <CommandGroup>
              {list.map((customer) => {
                const { id, name } = customer
                return (
                  <CommandItem
                    key={id}
                    value={name}
                    onSelect={() => {
                      onChange(id)
                      setPopOverOpen(false)
                    }}
                  >
                    <span>{name}</span>
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

export { WarehouseCommand }
