"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Messages, useTranslations } from "use-intl"

type Item = {
  href: string
  text: keyof Messages
  icon: React.ReactNode
}

type Props = Item & {
  subItems: Item[]
}

const SidebarItem = (props: Props) => {
  const t = useTranslations()
  const pathname = usePathname()
  const router = useRouter()
  const { setOpenMobile, isMobile, state } = useSidebar()

  return (
    <Collapsible asChild defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={t(props.text)}
            onClick={
              state === "collapsed" ? () => router.push(props.href) : undefined
            }
            isActive={state === "collapsed" && pathname === props.href}
          >
            {props.icon}
            <span className="font-semibold">{t(props.text)}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {props.subItems.map((item) => (
              <SidebarMenuSubItem
                key={item.href}
                onClick={() => {
                  if (isMobile) setOpenMobile(false)
                }}
              >
                <SidebarMenuSubButton asChild isActive={pathname === item.href}>
                  <Link href={{ pathname: item.href }}>
                    {item.icon}
                    <span>{t(item.text)}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export { SidebarItem }
