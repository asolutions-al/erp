"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { customerImageBucket } from "@/constants/bucket"
import { publicStorageUrl } from "@/constants/consts"
import { CustomerSchemaT } from "@/db/app/schema"
import { cn } from "@/lib/utils"
import {
  CheckCircleIcon,
  ChevronsUpDownIcon,
  ContactIcon,
  PlusCircleIcon,
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
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={t("Search customer") + "..."} />
          <CommandList>
            <CommandEmpty>
              <Empty />
            </CommandEmpty>
            <CommandGroup>
              {list.map((item) => {
                const { idType, idValue, id, name, imageBucketPath } = item
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

export { CustomerCommand }
