"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Column } from "@tanstack/react-table"
import {
  CalendarIcon,
  CheckCircleIcon,
  EraserIcon,
  FilterIcon,
  XIcon,
} from "lucide-react"
import { Messages, useTranslations } from "next-intl"
import React, { useState } from "react"

interface FilterProps<TData, TValue> {
  column: Column<TData, TValue>
  title: keyof Messages
}

const StringFilter = <TData, TValue>({
  column,
  title,
}: FilterProps<TData, TValue>) => {
  const t = useTranslations()
  const filterValue = (column.getFilterValue() as string) ?? ""

  return (
    <div className="p-1.5">
      <div
        className={cn(
          "relative flex h-8 items-center rounded-md border border-dashed",
          filterValue && "border-solid bg-accent"
        )}
      >
        <Input
          placeholder={`${t("Search")} ${t(title)}...`}
          value={filterValue}
          onChange={(event) => column.setFilterValue(event.target.value)}
          className="h-full border-0 bg-transparent text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {filterValue && (
          <Button
            variant="ghost"
            onClick={() => column.setFilterValue("")}
            className="absolute right-1 h-6 w-6 p-0 hover:bg-muted"
          >
            <XIcon className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}

const NumberFilter = <TData, TValue>({
  column,
  title,
}: FilterProps<TData, TValue>) => {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const filterValue = (column.getFilterValue() as [number, number]) ?? [0, 0]
  const [min, max] = filterValue

  // Local state for temporary values
  const [tempMin, setTempMin] = useState<number>(min)
  const [tempMax, setTempMax] = useState<number>(max)

  // Update local state when popover opens or filter value changes
  React.useEffect(() => {
    setTempMin(min)
    setTempMax(max)
  }, [min, max, isOpen])

  const applyFilter = () => {
    if (tempMin === 0 && tempMax === 0) {
      column.setFilterValue(undefined)
    } else {
      column.setFilterValue([tempMin, tempMax])
    }
    setIsOpen(false)
  }

  const clearFilter = () => {
    setTempMin(0)
    setTempMax(0)
    column.setFilterValue(undefined)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyFilter()
    }
  }

  const isDirty = min !== 0 || max !== 0

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="p-1.5">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-full justify-start border border-dashed text-xs",
              isDirty && "border-solid bg-accent"
            )}
          >
            <FilterIcon className="mr-2 h-3 w-3" />
            <span className="truncate">{t(title)}</span>
            {isDirty && (
              <div className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                1
              </div>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="start" side="bottom">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium leading-none">
              {t("Filter by")} {title}
            </h4>
            <p className="text-xs text-muted-foreground">
              {t("Set the numeric range for this column")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="min" className="text-xs font-medium">
                {t("Min")}
              </Label>
              <Input
                id="min"
                type="number"
                placeholder="0"
                value={tempMin || ""}
                onChange={(e) => setTempMin(Number(e.target.value) || 0)}
                className="h-8 text-xs"
                onKeyDown={handleKeyDown}
              />
            </div>
            <div>
              <Label htmlFor="max" className="text-xs font-medium">
                {t("Max")}
              </Label>
              <Input
                id="max"
                type="number"
                placeholder="999999"
                value={tempMax || ""}
                onChange={(e) => setTempMax(Number(e.target.value) || 0)}
                className="h-8 text-xs"
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              onClick={clearFilter}
              size="sm"
              className="text-xs"
            >
              <EraserIcon />
              {t("Clear")}
            </Button>
            <Button onClick={applyFilter} size="sm" className="text-xs">
              <CheckCircleIcon />
              {t("Apply")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

const DateFilter = <TData, TValue>({
  column,
  title,
}: FilterProps<TData, TValue>) => {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const filterValue = (column.getFilterValue() as [Date, Date]) ?? [null, null]
  const [from, to] = filterValue

  // Local state for temporary values
  const [tempFrom, setTempFrom] = useState<Date | undefined>(from)
  const [tempTo, setTempTo] = useState<Date | undefined>(to)

  // Update local state when popover opens or filter value changes
  React.useEffect(() => {
    setTempFrom(from)
    setTempTo(to)
  }, [from, to, isOpen])

  const applyFilter = () => {
    if (!tempFrom && !tempTo) {
      column.setFilterValue(undefined)
    } else {
      column.setFilterValue([tempFrom, tempTo])
    }
    setIsOpen(false)
  }

  const clearFilter = () => {
    setTempFrom(undefined)
    setTempTo(undefined)
    column.setFilterValue(undefined)
    setIsOpen(false)
  }

  const isDirty = from || to

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="p-1.5">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-full justify-start border border-dashed text-xs",
              isDirty && "border-solid bg-accent"
            )}
          >
            <CalendarIcon className="mr-2 h-3 w-3" />
            <span className="truncate">{t(title)}</span>
            {isDirty && (
              <div className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                1
              </div>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" side="bottom">
        <div className="space-y-4 p-4">
          <div>
            <h4 className="text-sm font-medium leading-none">
              {t("Filter by")} {title}
            </h4>
            <p className="text-xs text-muted-foreground">
              {t("Pick a date range")}
            </p>
          </div>
          <Calendar
            mode="range"
            selected={{ from: tempFrom, to: tempTo }}
            onSelect={(range) => {
              const from = range?.from ? new Date(range.from) : undefined
              const to = range?.to ? new Date(range.to) : undefined

              if (from) from.setHours(0, 0, 0, 0)
              if (to) to.setHours(23, 59, 59, 999)

              setTempFrom(from)
              setTempTo(to)
            }}
            initialFocus
            className="rounded-md border"
          />
          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              onClick={clearFilter}
              size="sm"
              className="text-xs"
            >
              <EraserIcon />
              {t("Clear")}
            </Button>
            <Button onClick={applyFilter} size="sm" className="text-xs">
              <CheckCircleIcon />
              {t("Apply")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

const BooleanFilter = <TData, TValue>({
  column,
  title,
}: FilterProps<TData, TValue>) => {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const filterValue = column.getFilterValue() as boolean | undefined

  const setFilter = (value: boolean | undefined) => {
    column.setFilterValue(value)
    setIsOpen(false)
  }

  const isDirty = filterValue !== undefined

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="p-1.5">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-full justify-start border border-dashed text-xs",
              isDirty && "border-solid bg-accent"
            )}
          >
            <FilterIcon className="mr-2 h-3 w-3" />
            <span className="truncate">{t(title)}</span>
            {isDirty && (
              <div className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                1
              </div>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-3" align="start" side="bottom">
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-none">
              {t("Filter by")} {title}
            </h4>
          </div>
          <div className="space-y-1">
            <Button
              variant={filterValue === undefined ? "default" : "ghost"}
              className="h-8 w-full justify-start text-xs"
              onClick={() => setFilter(undefined)}
            >
              {t("All")}
            </Button>
            <Button
              variant={filterValue === true ? "default" : "ghost"}
              className="h-8 w-full justify-start text-xs"
              onClick={() => setFilter(true)}
            >
              {t("Yes")}
            </Button>
            <Button
              variant={filterValue === false ? "default" : "ghost"}
              className="h-8 w-full justify-start text-xs"
              onClick={() => setFilter(false)}
            >
              {t("No")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

const SelectFilter = <TData, TValue>({
  column,
  title,
}: FilterProps<TData, TValue>) => {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const filterValue = column.getFilterValue() as string | undefined

  const dynamicOptions = React.useMemo(() => {
    const facetedValues = column.getFacetedUniqueValues()
    const uniqueValues = Array.from(facetedValues.keys())
      .filter((value) => value !== null && value !== undefined && value !== "")
      .map((value) => ({
        label: t(value as keyof Messages),
        value: String(value),
      }))
      .sort((a, b) => a.label.localeCompare(b.label))

    return uniqueValues
  }, [column])

  const filteredOptions = dynamicOptions.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  const setFilter = (value: string | undefined) => {
    column.setFilterValue(value)
    setIsOpen(false)
    setSearchValue("")
  }

  const isDirty = filterValue !== undefined

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="p-1.5">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-full max-w-[150px] justify-start border border-dashed text-xs",
              isDirty && "border-solid bg-accent"
            )}
          >
            <FilterIcon className="mr-2 h-3 w-3" />
            <span className="truncate">{t(title)}</span>
            {isDirty && (
              <div className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                1
              </div>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start" side="bottom">
        <Command>
          <div className="p-3 pb-2">
            <h4 className="text-sm font-medium leading-none">
              {t("Filter by")} {t(title)}
            </h4>
          </div>
          <CommandInput
            placeholder={`${t("Search")} ${t(title)}...`}
            value={searchValue}
            onValueChange={setSearchValue}
            className="h-9"
          />
          <CommandEmpty>No options found</CommandEmpty>
          <CommandList>
            <CommandGroup className="max-h-[200px] overflow-auto">
              <CommandItem
                onSelect={() => setFilter(undefined)}
                className="flex cursor-pointer items-center space-x-2"
              >
                <span className="flex-1">{t("All")}</span>
                {filterValue === undefined && (
                  <CheckCircleIcon className="h-4 w-4" />
                )}
              </CommandItem>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => setFilter(option.value)}
                  className="flex cursor-pointer items-center space-x-2"
                >
                  <span className="flex-1">{option.label}</span>
                  {filterValue === option.value && (
                    <CheckCircleIcon className="h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const MultiSelectFilter = <TData, TValue>({
  column,
  title,
}: FilterProps<TData, TValue>) => {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const filterValue = (column.getFilterValue() as string[]) ?? []

  // Local state for temporary values
  const [tempSelected, setTempSelected] = useState<string[]>([])

  // Update local state when popover opens or filter value changes
  // React.useEffect(() => {
  //   setTempSelected(filterValue)
  // }, [filterValue, isOpen])

  const dynamicOptions = React.useMemo(() => {
    const facetedValues = column.getFacetedUniqueValues()
    const uniqueValues = Array.from(facetedValues.keys())
      .filter((value) => value !== null && value !== undefined && value !== "")
      .map((value) => ({
        label: String(value),
        value: String(value),
      }))
      .sort((a, b) => a.label.localeCompare(b.label))

    return uniqueValues
  }, [column])

  const filteredOptions = dynamicOptions.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  const applyFilter = () => {
    if (tempSelected.length === 0) {
      column.setFilterValue(undefined)
    } else {
      column.setFilterValue(tempSelected)
    }
    setIsOpen(false)
  }

  const clearFilter = () => {
    setTempSelected([])
    column.setFilterValue(undefined)
    setIsOpen(false)
  }

  const toggleOption = (value: string) => {
    setTempSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )
  }

  const selectAll = () => {
    setTempSelected(dynamicOptions.map((option) => option.value))
  }

  const deselectAll = () => {
    setTempSelected([])
  }

  const isDirty = filterValue.length > 0

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="p-1.5">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-full max-w-[200px] justify-start border border-dashed text-xs",
              isDirty && "border-solid bg-accent"
            )}
          >
            <FilterIcon className="mr-2 h-3 w-3" />
            <span className="truncate">{t(title)}</span>
            {isDirty && (
              <div className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {filterValue.length}
              </div>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start" side="bottom">
        <Command>
          <div className="p-3 pb-2">
            <h4 className="text-sm font-medium leading-none">
              {t("Filter by")} {t(title)}
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Select multiple options
            </p>
          </div>
          <CommandInput
            placeholder={`${t("Search")} ${t(title)}...`}
            value={searchValue}
            onValueChange={setSearchValue}
            className="h-9"
          />
          <div className="border-b px-3 py-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs"
                onClick={selectAll}
                disabled={tempSelected.length === dynamicOptions.length}
              >
                {t("All")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs"
                onClick={deselectAll}
                disabled={tempSelected.length === 0}
              >
                {t("Clear")}
              </Button>
            </div>
          </div>
          <CommandEmpty>No options found</CommandEmpty>
          <CommandList>
            <CommandGroup className="max-h-[200px] overflow-auto">
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => toggleOption(option.value)}
                  className="flex cursor-pointer items-center space-x-2"
                >
                  <Checkbox
                    checked={tempSelected.includes(option.value)}
                    onChange={() => toggleOption(option.value)}
                  />
                  <span className="flex-1">{option.label}</span>
                  {tempSelected.includes(option.value) && (
                    <CheckCircleIcon className="h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <div className="flex justify-between border-t p-3 pt-2">
            <Button
              variant="outline"
              onClick={clearFilter}
              size="sm"
              className="text-xs"
            >
              <EraserIcon className="mr-1 h-3 w-3" />
              {t("Clear")}
            </Button>
            <Button onClick={applyFilter} size="sm" className="text-xs">
              <CheckCircleIcon className="mr-1 h-3 w-3" />
              {t("Apply")}
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export {
  BooleanFilter,
  DateFilter,
  MultiSelectFilter,
  NumberFilter,
  SelectFilter,
  StringFilter,
}
