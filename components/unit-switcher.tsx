import { BuildingIcon, ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { db } from "@/db/app/instance"
import { unit } from "@/orm/app/schema"
import { eq } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

type Props = {
  params: Promise<GlobalParams>
}

const UnitSwitcher = async (props: Props) => {
  const t = await getTranslations()
  const { orgId, unitId } = await props.params
  const units = await db.query.unit.findMany({
    where: eq(unit.orgId, orgId),
  })

  const activeUnit = units.find((unit) => unit.id === unitId)

  if (!activeUnit) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <BuildingIcon />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeUnit.name}
                </span>
                <span className="truncate text-xs">
                  {activeUnit.description}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {t("Units")}
            </DropdownMenuLabel>
            {units.map((unit, index) => (
              <DropdownMenuItem key={unit.name} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <BuildingIcon />
                </div>
                {unit.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <Link href={`/org/${orgId}/~/create`}>
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  {t("Add unit")}
                </div>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { UnitSwitcher }
