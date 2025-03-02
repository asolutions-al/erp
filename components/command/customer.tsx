"use client"

import { Button } from "@/components/ui/button"
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { customerImageBucket } from "@/contants/bucket"
import { publicStorageUrl } from "@/contants/consts"
import { CustomerSchemaT } from "@/db/app/schema"
import { cn } from "@/lib/utils"
import {
  CheckIcon,
  ChevronsUpDownIcon,
  ContactIcon,
  PlusCircleIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Command } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

const Empty = () => {
  const t = useTranslations()
  const { orgId, unitId } = useParams<GlobalParams>()
  return (
    <div className="flex flex-col items-center text-muted-foreground">
      <ContactIcon className="mb-4 h-12 w-12" />
      <p className="mb-4">{t("Customer not found")}</p>
      <Link href={`/o/${orgId}/u/${unitId}/customer/create`} passHref>
        <Button>
          <PlusCircleIcon />
          {t("Create new customer")}
        </Button>
      </Link>
    </div>
  )
}

const CustomerCommand = ({
  list,
  value,
  onChange,
}: {
  list: CustomerSchemaT[]
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
            : `${t("Name or ID")}...`}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={t("Search customer") + "..."} />
          <CommandList>
            <CommandEmpty>
              <Empty />
            </CommandEmpty>
            <CommandGroup>
              {list.map((customer) => {
                const { idType, idValue, id, name, imageBucketPath } = customer
                return (
                  <CommandItem
                    key={id}
                    value={name}
                    onSelect={() => {
                      onChange(id)
                      setPopOverOpen(false)
                    }}
                  >
                    <Avatar className="mr-2">
                      {imageBucketPath ? (
                        <AvatarImage
                          src={`${publicStorageUrl}/${customerImageBucket}/${imageBucketPath}`}
                          alt={name}
                        />
                      ) : (
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{name}</span>
                      {idValue && (
                        <span className="text-sm text-muted-foreground">
                          {t(idType)}: {idValue}
                        </span>
                      )}
                    </div>
                    <CheckIcon
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

export { CustomerCommand }
