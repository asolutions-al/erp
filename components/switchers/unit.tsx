import { AudioWaveformIcon, ChevronsUpDown, Plus } from "lucide-react"

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
  useSidebar,
} from "@/components/ui/sidebar"
import { UnitSchemaT } from "@/db/(inv)/schema"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"

const UnitSwitcher = ({ units }: { units: UnitSchemaT[] }) => {
  const t = useTranslations()
  const { isMobile } = useSidebar()
  const params = useParams<{ unitId: string }>()
  const activeTeam = units.find((team) => team.id === params.unitId)!

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
                <AudioWaveformIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">
                  {activeTeam.description}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {t("Units")}
            </DropdownMenuLabel>
            {units.map((unit, index) => (
              <Link href={`/${unit.id}/dashboard`} key={unit.name}>
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={() => {
                    console.log("Switching to shop", unit.name)
                  }}
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <AudioWaveformIcon className="size-4 shrink-0" />
                  </div>
                  {unit.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>
            ))}
            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                {t("Create unit")}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { UnitSwitcher }
