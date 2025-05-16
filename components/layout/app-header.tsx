import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"

type Props = {
  params: Promise<GlobalParams>
}

const AppHeader = async (props: Props) => {
  const { orgId, unitId } = await props.params
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b px-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Link
          href={
            unitId
              ? `/o/${orgId}/u/${unitId}/overview/dashboard/today`
              : orgId
                ? `/o/${orgId}/unit/list`
                : `/o/list`
          }
        >
          <Image src="/logo.png" alt="logo" width={30} height={30} />
        </Link>
      </div>
    </header>
  )
}

export { AppHeader }
