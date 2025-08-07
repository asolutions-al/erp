import { ChevronsUpDown, StoreIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { db } from "@/db/app/instance"
import { getUserId } from "@/db/auth/loaders"
import { organization } from "@/orm/app/schema"
import { eq } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import { OrgSwitcherItem } from "./org-switcher-item"

type Props = {
  params: Promise<GlobalParamsT>
}

const OrgSwitcher = async (props: Props) => {
  const t = await getTranslations()
  const { orgId } = await props.params
  const userId = await getUserId()

  if (!userId) return null

  const orgs = await db.query.organization.findMany({
    where: eq(organization.ownerId, userId),
  })

  const activeOrg = orgs.find((org) => org.id === orgId)

  if (!activeOrg) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <StoreIcon />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeOrg.name}</span>
                <span className="truncate text-xs">
                  {activeOrg.description}
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
              {t("Organizations")}
            </DropdownMenuLabel>
            {orgs.map((org) => (
              <OrgSwitcherItem key={org.id} data={org} />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { OrgSwitcher }
